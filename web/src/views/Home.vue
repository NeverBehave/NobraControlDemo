<template>
  <b-container>
    <b-row>
      <b-col>
        <b-button @click="isReady">Check Status</b-button>
      </b-col>
    </b-row>
    <b-row>
        <b-col>
          {{ str }}
        </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      status: false
    }
  },
  computed: {
    str () {
      return this.status ? 'Ready, go to adjust tab and enjoy!' : 'Not yet ready'
    }
  },
  mounted () {
    this.$options.sockets.onmessage = (data) => {
      const d = JSON.parse(data.data)
      if (d.command === 1) {
        this.status = d.status
      }
    }
  },
  methods: {
    isReady () {
      this.$socket.sendObj({ command: 1, data: '' })
      this.$bvToast.toast('Request sent', {
        title: 'Check Status',
        'auto-hide-delay': '1000'
      })
    }
  }
}
</script>
