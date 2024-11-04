<template>

  <body data-bs-spy="scroll" data-bs-target=".navbar" data-bs-offset="50">
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
      <div class="container-fluid">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#section1">Add Community</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#section2">Add Collection</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#section3">Add Ítem</a>
          </li>
        </ul>
      </div>
    </nav>
  </body>

  <div id="section1" class="container-fluid bg" style="padding:250px 20px;">
    <AddCommunity @submit-comm="handleSubmitComm" />
  </div>

  <div id="section2" class="container-fluid bg" style="padding:250px 20px;">
    <AddCollection @submit-item="handleSubmitColl" />
  </div>

  <div id="section3" class="container-fluid bg" style="padding:250px 20px;">
    <AddItem @submit-item="handleSubmitItem" />
  </div>

</template>
  

  <script setup lang="ts">
    import AddItem from '~/components/AddItem.vue';
    import AddCommunity from '~/components/AddCommunity.vue';
    import AddCollection from '~/components/AddCollection.vue';
    
    const handleSubmitItem = () => {
      console.log('GO FORM');
    };

    const handleSubmitComm = () => {
      console.log('GO FORM COMMUNITY');
    };

    const handleSubmitColl = () => {
      console.log('GO FORM COLLECTION');
    };
  </script>
  
  <style scoped>
    form {
      display: flex;
      flex-direction: column;
      max-width: 300px;
      margin: auto;
    }
    
    label {
      margin-top: 10px;
    }
    
    button {
      margin-top: 15px;
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #0056b3;
    }
    
    .error {
      color: red;
    }
  </style>
  