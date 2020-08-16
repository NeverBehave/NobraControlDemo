<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Status</router-link> |
      <router-link to="/adjust">Adjust</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted () {
    const h = location.host.split(':')[0]
    console.debug('detected: ', h)
    this.$connect(`ws://${h}:12123`, { format: 'json', reconnection: true })
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  -webkit-user-select:none;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
