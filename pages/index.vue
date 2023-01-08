<template>
  <div>
    <HeaderView />
    <ArtSearch />
  </div>
</template>

<script>
import HeaderView from '../components/HeaderView.vue'
import ArtSearch from '../components/ArtSearch.vue'

export default {
  name: 'IndexPage',
  components: { HeaderView, ArtSearch }
}
</script>
