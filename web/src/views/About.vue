<template>
  <b-container>
    <b-row>
      <b-col>
        <b-form-input type="range" v-model="level" min="0" max="15"></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p class="text-center">{{ level }}</p>
      </b-col>
      <b-col>
        <b-button @click="stop">Pause</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      level: '0'
    }
  },
  methods: {
    stop () {
      this.level = '0'
    }
  },
  watch: {
    level (n) {
      this.$socket.sendObj({ command: 2, data: n })
    }
  }
}
</script>
