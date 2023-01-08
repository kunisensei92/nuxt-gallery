import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export const state = () => ({
  artworks: [],
  page: 1,
  limit: 6,
  q: '',
  total: 0,
  loading: false
})

export const mutations = {
  SET_ARTWORKS (state, artworks) {
    state.artworks = artworks
  },
  SET_PAGE (state, page) {
    state.page = page
  },
  SET_Q (state, q) {
    state.q = q
  },
  SET_LOADING (state, loading) {
    state.loading = loading
  }
}

export const actions = {
  async fetchArtworks ({ commit, state }) {
    commit('SET_LOADING', true)
    const { data } = await axios.get(
      `https://api.artic.edu/api/v1/artworks/search?fields=id,title,thumbnail,image_id&q=${state.q}&page=${state.page}&limit=${state.limit}`
    ).then((res) => {
      commit('SET_LOADING', false)
      return res
    })
    commit('SET_ARTWORKS', data.data)
  },
  async fetchMoreArtworks ({ commit, state }) {
    commit('SET_LOADING', true)
    commit('SET_PAGE', state.page + 1)
    const { data } = await axios.get(
      `https://api.artic.edu/api/v1/artworks/search?fields=id,title,thumbnail,image_id&q=${state.q}&page=${state.page}&limit=${state.limit}`
    ).then((res) => {
      commit('SET_LOADING', false)
      return res
    })
    commit('SET_ARTWORKS', [...state.artworks, ...data.data])
  },
  async searchArtworks ({ commit, state }, q) {
    commit('SET_PAGE', 1)
    commit('SET_ARTWORKS', [])
    commit('SET_Q', q)
    commit('SET_LOADING', true)
    const { data } = await axios.get(
      `https://api.artic.edu/api/v1/artworks/search?fields=id,title,thumbnail,image_id&q=${state.q}&page=${state.page}&limit=${state.limit}`
    ).then((res) => {
      commit('SET_LOADING', false)
      return res
    })
    commit('SET_ARTWORKS', data.data)
  }
}

export const getters = {
  artworks: state => state.artworks,
  page: state => state.page,
  limit: state => state.limit,
  q: state => state.q,
  total: state => state.total,
  loading: state => state.loading
}
