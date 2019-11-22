
Vue.component('myfooter', {
  props: {
      foo: {
      type: String,
      required: true,
    }
  },
    template:`<footer>{{foo}}</footer>`,
})

Vue.component('searchbar',{
    template:`
     <div>
      <header>
          <nav>
           <div class="logoPlacholder"><img src="./asset/logo.jpg" @click="reload"></div>
            <form class="searchForm" @submit.prevent="onSubmitHandler">
              <button class="searchBtn" type="submit">Search</button>
              <input v-model="searchInput" class="searchInput" type="search" placeholder="search for images"/>
            </form>
          </nav>
      </header>
    </div>
    `,
    data() {
      return {
        searchInput: null,
        keyword: null,
      }
    },
    methods: {
      onSubmitHandler(){
        const url = "https://api.unsplash.com/search/photos/?page=1&per_page=10&query=";
        fetch(url + this.searchInput + "&client_id=YOUR_ACCESS_KEY")
        .then(res => {
        return res.json();
        })
        .then(data => {
          if(data.results.length){
          let result = data.results
          this.$emit('query-result', result);
          this.$emit('get-keyword', this.searchInput);
          console.log(result,this.searchInput,"DATA")
        } else {
            alert("Image Not found")
            }
        });
      },
      reload(){
        location.reload();
      }
    }
});

Vue.component('gallery',{
  props: {
    getkeyword:{
      type: String,
      required: true,
      default: "Search Something"
    },
    displayresults: {
      type: Array,
      required: true,
    }
  },
  template:
  `<div class="mainGallery">
      <h2>{{ getkeyword}}</h2>
      <p v-if="!displayresults.length">Search for Image Using the Search Bar</p>
        <div class="lightbox">
          <div class="photoItem" v-for="result in displayresults" @click=selectItem(result)>
            <img :src="result.urls.small">
          </div>
        </div>
        <overlay @set-modal-status="setModal" :openmodal="modalDisplay" :propsSelected="selectedImage"></overlay>
    </div>
  `,
    data(){
      return {
        selectedImage: [],
        modalDisplay: false,
      }
    },
    methods: {
    selectItem(result){
      this.selectedImage.push(result);
      console.log(this.selectedImage, "selectedImage");
      this.modalDisplay = true;
    },
    setModal(data){
      this.modalDisplay = data;
    },
  },
  computed: {

  }
});

Vue.component('overlay',{
  props: {
    openmodal: {
      type: Boolean,
    },
    propsSelected: {
      type: Array,
      required: true
    }
  },
  template:
  `
  <div class="overlay" v-show="openmodal">
    <button class="overlayBtn" type="button" @click="closemodal">x</button>
    <div class="selected" v-if="propsSelected.length">
      <div class="selectedHeader">
        <div class="user">
          <img :src="propsSelected[0].user.profile_image.small">
          <p>{{ username }}</p>
        </div>
      <h2>{{propsSelected[0].alt_description}}</h2>
      <a class="download" target="_blank" :href="downloadUrl"> Download</a>
      </div>
      <div class="imageHolder">
        <img :src="propsSelected[0].urls.regular">
      </div>
    </div>
    <div v-else class="selected"><h2>Something is Wrong</h2></div>
  </div>
`,
  data(){
    return {
        closeModal: false,
    }
  },
  methods: {
    closemodal(){
      console.log(this.closeModal,"closemodal")
      this.propsSelected.shift();
      console.log(this.propsSelected,"this.propsSelected")
      this.$emit('set-modal-status', this.closeModal)
    }
  },
  computed: {
    username(){
      return this.propsSelected[0].user.first_name +' ' + this.propsSelected[0].user.last_name
    },
    downloadUrl(){
      return this.propsSelected[0].links.download + '?force=true'
    }
  }
})

var app = new Vue({
  el: '#app',
  data(){
    return {
    footerdescrp: "Copyright Reserved",
    queryResult: [],
    searchKeyWord: " ",
    cart: [],
    }
  }
  ,
  methods: {
  addQueryResult(result){
      this.queryResult = result;
      console.log(this.queryResult,"result")
  },
  addKeyWord(data){
    this.searchKeyWord = `Search Result for: "${data}"`;
    console.log(this.searchKeyWord, "key");
    }
  },
  mounted(){
    console.log("halo World")
    const url = "https://api.unsplash.com/photos?per_page=20&client_id=YOUR_ACCESS_KEY";
        fetch(url)
        .then(res => {
        return res.json();
        })
        .then(data => {
            console.log(data,"mounted")
          this.queryResult = data;
        })
     }
});
