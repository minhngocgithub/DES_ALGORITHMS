import {
    init_perm_64,
    exp_table_64,
    s_boxes_64,
    perm_tab_64,
    inv_perm_64,
    pc1_64,
    pc2_64,
} from '../utils/data'

const utils = {
    // Shift left 1 bit
    shift_left_once: function(key_chunk) {
        return key_chunk.slice(1) + key_chunk[0];
    },

    // Shift left 2 bits
    shift_left_twice: function(key_chunk) {
        return this.shift_left_once(this.shift_left_once(key_chunk));
    },
    
    // Function to convert a number from decimal to binary
    convertDecimalToBinary: function(decimal) {
        let binary = "";
        while (decimal !== 0) {
            binary = (decimal % 2 === 0 ? "0" : "1") + binary; 
            decimal = Math.floor(decimal / 2);
        }
        while (binary.length < 4) binary = "0" + binary;
        return binary;
    },

    // Function to convert a number from binary to decimal
    convertBinaryToDecimal: function(binary) {
        let decimal = 0;
        let counter = 0;
        let size = binary.length;
        for (let i = size - 1; i >= 0; i--) {
            if (binary[i] === '1') decimal += Math.pow(2, counter);
            counter++;
        }
        return decimal;
    },

    // Function to calculate XOR of 2 strings
    Xor: function(a, b) {
        let res = ""; 
        let size = b.length;
        for (let i = 0; i < size; i++) {
            res += (a[i] !== b[i]) ? '1' : '0';
        }
        return res; 
    },

    generate_keys: function(n, weak_key, main_key) {
        // Use weak_key if provided, otherwise use main_key
        let key = weak_key !== "" ? weak_key : main_key;

        // Parameters for 64-bit key
        const pc1 = pc1_64; // Ensure these constants are defined
        const pc2 = pc2_64;
        const key_limit = 56;
        const key_length = 48;
        const halfKeyLimit = key_limit / 2;

        // Compressing the key using PC1 table
        let perm_key = Array.from({ length: key_limit }, (_, i) => key[pc1[i] - 1]).join('');

        // Dividing the result into 2 equal halves
        let left = perm_key.slice(0, halfKeyLimit);
        let right = perm_key.slice(halfKeyLimit, key_limit);

        // Generating N keys
        const round_keys = [];

        for (let i = 0; i < n; i++) {
            // Shift left based on round number
            if (i === 0 || i === 1 || i === 8 || i === 15) {
                left = this.shift_left_once(left);
                right = this.shift_left_once(right);
            } else {
                left = this.shift_left_twice(left);
                right = this.shift_left_twice(right);
            }

            // Combining the chunks
            let combined_key = left + right;

            // Using PC2 table to transpose the bits
            let round_key = Array.from({ length: key_length }, (_, j) => combined_key[pc2[j] - 1]).join('');
            round_keys.push(round_key);
        }

        return round_keys;
    },

    DES: function(plainText, keys, n) {
        // Define constants for 64-bit DES
        const init_perm = init_perm_64; // Ensure these constants are defined
        const inv_perm = inv_perm_64;
        const exp_table = exp_table_64;
        const perm_tab = perm_tab_64;
        const s_boxes = s_boxes_64;
        const key_length = 48;
        const width = 8;

        // 1. Applying the initial permutation
        let perm = "";
        for (let i = 0; i < 64; i++) perm += plainText[init_perm[i] - 1];

        // 2. Dividing the result into 2 equal halves
        let left = perm.substr(0, 32);
        let right = perm.substr(32, 32);

        // 3. Encrypting the plain text N times
        for (let i = 0; i < n; i++) {
            // 3.1 Expanding the right half of the text
            let right_expanded = "";
            for (let j = 0; j < key_length; j++) right_expanded += right[exp_table[j] - 1];

            // 3.2 The result is XORED with the round key
            let xored = this.Xor(keys[i], right_expanded);
            let res = "";

            // 3.4. Substitution through S-boxes
            for (let i = 0; i < width; i++) {
                let row1 = xored.substr(i * 6, 1) + xored.substr(i * 6 + 5, 1);
                let row = this.convertBinaryToDecimal(row1);
                let col1 = xored.substr(i * 6 + 1, 4);
                let col = this.convertBinaryToDecimal(col1);
                let val = s_boxes[i][row][col];
                res += this.convertDecimalToBinary(val);
            }

            // 3.5. Another permutation is applied
            let perm2 = "";
            for (let j = 0; j < 32; j++) perm2 += res[perm_tab[j] - 1];

            // 3.6. The result is XORED with the left half
            xored = this.Xor(perm2, left);

            // 3.7. Swapping the left and right parts of plain text
            left = xored;
            if (i < (n - 1)) {
                [left, right] = [right, left]; // Swap left and right
            }
        }

        // 4. Combining the halves of plain text
        let combined_text = left + right;
        let ciphertext = "";

        // 5. Applying inverse of permutation
        for (let i = 0; i < 64; i++) ciphertext += combined_text[inv_perm[i] - 1];

        // Returning the cipher text
        return ciphertext;
    }
};

export default utils;
