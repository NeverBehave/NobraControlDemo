<template>
  <b-container>
    <b-row>
      <b-col>
        <b-form-input size="lg" type="range" v-model="level" min="0" max="15"></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p class="text-center">{{ level }}</p>
      </b-col>
      <b-col>
        <b-button :pressed.sync="mode" variant="primary">{{ modeString }}</b-button>
      </b-col>
      <b-col>
        <b-button @click="stop">Pause</b-button>
      </b-col>
    </b-row>
    <b-row class="mt-5">
      <b-col class="center">
        <b-button size="lg" @mousedown="down" @touchstart.stop.prevent="down" @mouseup="up" @touchend="up">Control Button</b-button>
      </b-col>
    </b-row>
    <b-row class="mt-5">
      <b-col class="center">
        {{ event }} {{ fire }}
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      level: '0',
      prev_level: '0',
      mode: false, // true to hold, false totoggle
      event: 'nothing',
      fire: 0
    }
  },
  computed: {
    modeString () {
      return this.mode ? 'hold' : 'toggle'
    },
    isStop () {
      return this.level === '0'
    }
  },
  methods: {
    stop () {
      this.level = '0'
    },
    setLevel () {
      this.level = this.prev_level
    },
    releaseLevel () {
      this.prev_level = this.level
      this.stop()
    },
    down () {
      if (this.mode) {
        this.setLevel()
        this.event = 'hold&set'
      } else if (this.isStop) {
        this.setLevel()
        this.event = 'toggle&set'
        this.fire++
      } else {
        this.releaseLevel()
        this.event = 'toggle&stop'
        this.fire++
      }
    },
    up () {
      if (this.mode) {
        this.releaseLevel()
        this.event = 'old&stop'
      }
    }
  },
  watch: {
    level (n) {
      this.$socket.sendObj({ command: 2, data: n })
    }
  }
}
</script>
