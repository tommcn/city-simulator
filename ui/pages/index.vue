<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-hover v-slot="{ hover }">
          <v-sheet :elevation="hover ? 24 : 4" class="sheet">
            <v-list dense>
              <v-subheader>Streetlamps</v-subheader>
              <v-list-item v-for="sl in sls" :key="sl._id" two-line>
                <v-list-item-content>
                  <v-list-item-title class="device-id">{{
                    sl._id
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    sl.on ? 'On' : 'Off'
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider />
            <v-btn class="btn" color="primary" text @click="addStreetlamp"
              >Add</v-btn
            >
            <v-btn
              class="btn"
              color="error"
              text
              outlined
              @click="removeStreetlamp"
              >Remove</v-btn
            >
          </v-sheet>
        </v-hover>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.snackbar"
      :timeout="snackbar.timeout"
      :color="snackbar.type"
      right
      top
    >
      {{ snackbar.text }}

      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    message: 'Hello World',
    sls: [],
    snackbar: {
      snackbar: false,
      text: 'Hello, world👋 🌏 !',
      timeout: 1000,
      type: 'info',
    },
  }),
  head: {
    title: 'Home Page',
  },
  async mounted() {
    this.socket = this.$nuxtSocket({
      name: 'server',
      channel: '/',
    }) // TODO: figure out reconnection

    this.socket.on('connect', () => {
      this.snackbar.text = 'Connected'
      this.snackbar.type = 'success'
      this.snackbar.snackbar = true
    })
    this.socket.on('disconnect', () => {
      this.snackbar.text = 'Disconnected'
      this.snackbar.type = 'error'
      this.snackbar.snackbar = true
      this.sls = []
    })
    this.socket.on('streetLampAdded', () => {
      this.snackbar.text = 'Streetlamp added'
      this.snackbar.type = 'success'
      this.snackbar.snackbar = true
    })
    this.socket.on('streetLampRemoved', () => {
      this.snackbar.text = 'Streetlamp removed'
      this.snackbar.type = 'error'
      this.snackbar.snackbar = true
    })

    this.socket.on('tick', (data) => {
      this.sls = data.sls
    })
    await this.ping()
  },
  methods: {
    async ping() {
      await this.socket.emit('ping', { hello: 'world' })
    },
    async addStreetlamp() {
      await this.socket.emit('addStreetlamp', { hello: 'world' })
    },
    async removeStreetlamp() {
      await this.socket.emit('removeStreetlamp')
    },
  },
}
</script>
<style scoped>
.sheet {
  transition: 0.5s;
}
.btn {
  margin: 12px;
}
.device-id {
  font-family: monospace;
}
</style>
