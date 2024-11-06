// Example: Plaintext: 0011001100110011001100110011001100110011001100110011001100110011 Keys: 0123456789abcdef
<template>
  <div class="text-center mb-5 mt-5">
    <p>Example: </p>
    <plaintext>Plaintext: 0011001100110011001100110011001100110011001100110011001100110011</plaintext>
    <plaintext>Keys: 0011001100110011001100110011001100110011001100110011001100110011</plaintext>
    <!-- HEADING -->
    <h1> DES DEMONSTRATION </h1>

    <!-- TAKING INPUT FOR PLAIN TEXT -->
    <input
      class="mt-3"
      type="text"
      v-model="plainText"
      placeholder="Enter Plain Text (64 Bit Binary)"
    />

    <!-- TAKING INPUT FOR KEY -->
    <input
      class="mt-3"
      type="text"
      v-model="mainKey"
      placeholder="Enter Key (64 Bit Binary)"
    />

    <!-- GENERATING KEYS -->
    <div>
      <button class="btn btn-dark mt-2" @click="generateKeys"> Generate & Print Keys </button>
    </div>

    <!-- PRINTING KEYS -->
    <div class="mt-3 block">
      <div v-if="keys32.length > 0">
        <div v-for="(key, index) in keys32" :key="index">
          <b> Key For Round {{ index + 1 }}: </b> {{ key }}
        </div>
      </div>
      <span v-else> No Keys Generated </span>
    </div>

    <!-- ENCRYPTING THE PLAIN TEXT -->
    <div>
      <button class="btn btn-dark mt-2" @click="setCipheredText"> Cipher It </button>
    </div>
    <div class="block">
      <div class="mt-2"> <b> Ciphered Text for Number of rounds equal to 1 = {{ cipheredText1 }} </b> </div>
      <div class="mt-2"> <b> Ciphered Text for Number of rounds equal to 8 = {{ cipheredText8 }} </b> </div>
      <div class="mt-2"> <b> Ciphered Text for Number of rounds equal to 16 = {{ cipheredText16 }} </b> </div>
      <div class="mt-2"> <b> Ciphered Text for Number of rounds equal to 32 = {{ cipheredText32 }} </b> </div>
    </div>

    <!-- DECRYPTING THE CIPHER TEXT -->
    <div>
      <button class="btn btn-dark mt-2" @click="setDecipheredText"> DeCipher It </button>
    </div>
    <div class="block">
      <div class="mt-2"> <b> Deciphered Text for Number of rounds equal to 1 = {{ deCipheredText1 }} </b> </div>
      <div class="mt-2"> <b> Deciphered Text for Number of rounds equal to 8 = {{ deCipheredText8 }} </b> </div>
      <div class="mt-2"> <b> Deciphered Text for Number of rounds equal to 16 = {{ deCipheredText16 }} </b> </div>
      <div class="mt-2"> <b> Deciphered Text for Number of rounds equal to 32 = {{ deCipheredText32 }} </b> </div>
    </div>

    <!-- AVALANCHE EFFECT PART -->
    <h2 class="mt-5"> Avalanche Effect </h2>
    <p> Change any 1 or 2 bits in above plain text, then again create cipher text to see avalanche effect</p>
    <input
      type="text"
      v-model="text"
      placeholder="Enter Above Plain Text with 1 or 2 bits changed"
    />
    <div>
      <button class="btn btn-dark mt-3" @click="showEffect"> Cipher It </button>
    </div>
    <div class="block">
      <div class="mt-2"> <b> Ciphered Text for Number of rounds equal to 1 = {{ cipheredText_1 }} </b> <br /> <i> ({{ changes1 }} changes from original cipher text) </i> </div>
      <div class="mt-2"> <b> Ciphered Text for Number of rounds equal to 8 = {{ cipheredText_8 }} </b> <br /> <i> ({{ changes8 }} changes from original cipher text) </i> </div>
      <div class="mt-2"> <b> Ciphered Text for Number of rounds equal to 16 = {{ cipheredText_16 }} </b> <br /> <i> ({{ changes16 }} changes from original cipher text) </i> </div>
      <div class="mt-2"> <b> Ciphered Text for Number of rounds equal to 32 = {{ cipheredText_32 }} </b> <br /> <i> ({{ changes32 }} changes from original cipher text) </i> </div>
    </div>

    <!-- EFFECT OF WEAK KEYS PART -->
    <h2 class="mt-5"> Effect of Weak Keys </h2>
    <div>
      <input
        type="text"
        v-model="weakKey"
        placeholder="Enter Key (32, 64, or 128 bit binary) to generate round keys & check if it is weak or not"
      />
      <div>
        <button class="btn btn-dark mt-3" @click="generate_Keys"> Generate & Print Keys </button>
      </div>
      <div class="mt-3"> <b> {{ message }} </b> </div>
      <div class="mt-3 block">
        <div v-if="keys_32.length > 0">
          <div v-for="(key, index) in keys_32" :key="index">
            <b> Key For Round {{ index + 1 }}: </b> {{ key }}
          </div>
        </div>
        <span v-else> No Keys Generated </span>
      </div>
    </div>
  </div>

</template>
<script>
import HelloWorld from './components/HelloWorld.vue'
import utils from '../src/utils/index'
import { ref } from 'vue'
export default {
  setup() {
    const plainText = ref('')
    const mainKey = ref('')
    const text = ref('')

    const cipheredText1 = ref('')
    const cipheredText8 = ref('')
    const cipheredText16 = ref('')
    const cipheredText32 = ref('')

    const deCipheredText1 = ref('')
    const deCipheredText8 = ref('')
    const deCipheredText16 = ref('')
    const deCipheredText32 = ref('')

    const cipheredText_1 = ref('')
    const cipheredText_8 = ref('')
    const cipheredText_16 = ref('')
    const cipheredText_32 = ref('')

    const keys1 = ref([])
    const keys8 = ref([])
    const keys16 = ref([])
    const keys32 = ref([])

    const changes1 = ref(0)
    const changes8 = ref(0)
    const changes16 = ref(0)
    const changes32 = ref(0)

    const weakKey = ref('')
    const keys_32 = ref([])
    const message = ref('')

    const setCipheredText = () => {
      cipheredText1.value = utils.DES(plainText.value, keys1.value, 1)
      cipheredText8.value = utils.DES(plainText.value, keys8.value, 8)
      cipheredText16.value = utils.DES(plainText.value, keys16.value, 16)
      cipheredText32.value = utils.DES(plainText.value, keys32.value, 32)
    }

    const setDecipheredText = () => {
      console.log("hello");
      
      keys1.value.reverse()
      keys8.value.reverse()
      keys16.value.reverse()
      keys32.value.reverse()

      deCipheredText1.value = utils.DES(cipheredText1.value, keys1.value, 1)
      deCipheredText8.value = utils.DES(cipheredText8.value, keys8.value, 8)
      deCipheredText16.value = utils.DES(cipheredText16.value, keys16.value, 16)
      deCipheredText32.value = utils.DES(cipheredText32.value, keys32.value, 32)

      keys1.value.reverse()
      keys8.value.reverse()
      keys16.value.reverse()
      keys32.value.reverse()

    }
    const generateKeys = () => {
      if(plainText.value.length !== 64) {
        alert("Plain Text Length must be 64 ")
      } else {
        keys1.value = utils.generate_keys(1, plainText.value.length, mainKey.value)
        keys8.value = utils.generate_keys(8, plainText.value.length, mainKey.value)
        keys16.value = utils.generate_keys(16, plainText.value.length, mainKey.value)
        keys32.value = utils.generate_keys(32, plainText.value.length, mainKey.value)
      }
    }
    const diff = (a, b) => {
      let count = 0;
      for(let i = 0; i < a.length; i++) {
        if(a[i] !== b[i]) {
          count++
        }

      }
      return count
    }
    const showEffect = () => {
      const text1 = utils.DES(text.value, keys1.value, 1)
      const text8 = utils.DES(text.value, keys8.value, 8)
      const text16 = utils.DES(text.value, keys16.value, 16)
      const text32 = utils.DES(text.value, keys32.value, 32)
      
      cipheredText_1.value = text1
      cipheredText_8.value = text8
      cipheredText_16.value = text16
      cipheredText_32.value = text32

      changes1.value = diff(text1, cipheredText1.value)
      changes8.value = diff(text1, cipheredText8.value)
      changes16.value = diff(text1, cipheredText16.value)
      changes32.value = diff(text1, cipheredText32.value)
    }

    const generate_keys = () => {
      const keys32 = utils.generate_keys(32, weakKey.value.length, weakKey.value, mainKey.value)
      const keys = utils.generate_keys(32, weakKey.value.length, weakKey.value, mainKey.value)
      let st = new Set(keys)
      if(st.size <= 16) {
        message.value = "Given key is weak."
      } else {
        message.value = "Given key is not weak. "
      }
      console.log(st.size);
      
    }
    return {
      plainText,
      mainKey,
      text,
      cipheredText1, cipheredText8, cipheredText16, cipheredText32,
      deCipheredText1, deCipheredText8, deCipheredText16, deCipheredText32,
      keys1, keys8, keys16, keys32, keys_32,
      message,
      setCipheredText,
      setDecipheredText,
      generateKeys,
      showEffect,
      generate_keys
    }
    
  
  }
}
</script>
<style >
input {
  width: 200px;
  height: 50px;
  padding: 5px 25px;
  border-radius: 5px 5px;
}
</style>
