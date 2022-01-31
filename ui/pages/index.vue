<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6"> </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  head: {
    title: 'Home Page',
  },
  async mounted() {
    this.socket = this.$nuxtSocket({
      name: 'server',
      channel: '/',
    })
    this.socket.on('pong', (msg) => {
      console.log('pong', msg)
    })
    await this.ping()
  },
  methods: {
    async ping() {
      await this.socket.emit('ping', { hello: 'world' })
    },
  },
}
</script>
