export const state = () => ({})

export const mutations = {
  pong(state: object, text: any) {
    console.log('pong', text)
    console.log(state)
  },
}
