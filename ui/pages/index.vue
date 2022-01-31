<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-list-item v-for="sl in sls" :key="sl._id" two-line>
        <v-list-item-content>
          <v-list-item-title>{{ sl._id }}</v-list-item-title>
          <v-list-item-subtitle>{{
            sl.on ? 'On' : 'Off'
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    message: 'Hello World',
    sls: [],
  }),
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
    this.socket.on('tick', (data) => {
      console.log('Got data from server:', data)
      this.sls = data.sls
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
