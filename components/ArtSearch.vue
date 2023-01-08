<template>
  <main>
    <section>
      <div class="search">
        <input type="search" placeholder="Search for artworks" @keyup="searchArtworks">
        <img src="../static/search.svg" alt="Search for artworks">
      </div>
      <ul class="artworks-list">
        <li v-for="art in arts" :key="art.id" class="artworks-list__item">
          <div class="artworks-list__item-image">
            <img v-if="art.thumbnail" :src="art.thumbnail.lqip" :alt="art.thumbnail.alt_text" :data-src="art.image_id" class="fade-in">
          </div>
          <p class="artworks-list__item-title">
            {{ art.title }}
          </p>
        </li>
      </ul>
      <div v-if="$store.state.loading" class="loading">
        <img src="../static/loading.svg" alt="Loading">
      </div>
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ArtSearch',
  computed: {
    ...mapState({
      arts: state => state.artworks
    })
  },
  beforeMount () {
    window.addEventListener('scroll', this.onScroll)
  },
  mounted () {
    this.$store.dispatch('fetchArtworks')
  },
  updated () {
    if (this.$store.state.artworks.length > 0) {
      setTimeout(() => {
        this.lazyLoadImages()
      }, 200)
    }
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll () {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement
      const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight
      if (scrolledToBottom) {
        this.$store.dispatch('fetchMoreArtworks')
      }
      this.lazyLoadImages()
    },
    searchArtworks (event) {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.$store.dispatch('searchArtworks', event.target.value)
      }, 500)
    },
    lazyLoadImages () {
      const images = document.querySelectorAll('img[data-src]')
      images.forEach((image) => {
        const imageTop = image.getBoundingClientRect().top
        const imageBottom = image.getBoundingClientRect().bottom
        const isImageVisible = imageTop < window.innerHeight && imageBottom >= 0
        if (isImageVisible) {
          image.src = `https://www.artic.edu/iiif/2/${image.dataset.src}/full/843,/0/default.jpg`
          image.removeAttribute('data-src')
        }
      })
    }
  }
}

</script>

<style scoped>
.loading {
  position: fixed;
  top: 8px;
  right: 20px;
  width: 50px;
  margin: 0 auto;
}

</style>
