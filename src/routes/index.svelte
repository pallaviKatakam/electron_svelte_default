<script>
  import { onMount } from 'svelte';
  import {loginDetails, checkLogin} from '../store/store.js';
  import { goto } from '$app/navigation';

    let username = '';
    let password = '';
    let wrong_credentials = false;
    let btn;

    onMount(() => {
      btn = document.getElementById('create_file');

      btn.addEventListener('click', ()=>{
        window.api.send("createFile", "Hello World");
      })

      window.api.receive("fromMain", (data) => {
        console.log(data)
      });

      if(!sessionStorage.getItem('loginDetails')){
        loginDetails.subscribe(loginDetails => {
          
          if(loginDetails){
            let login_details = JSON.parse(loginDetails);
            
            if(login_details.username != ''){
              wrong_credentials = false;
              sessionStorage.setItem('loginDetails', loginDetails)
              goto('/room');
            }else{
              wrong_credentials = true;
            }
          }
        })
      }
    })

    function logins(name,password){
      checkLogin({'action':'login','username':name, 'password':password});
    }

</script>

<svelte:head>
    <title>Login Page</title>
</svelte:head>

<button  id="create_file">Create File</button>
<div id="login_div">
    <form on:submit|preventDefault={() => logins(username,password)}>
        <input type="text" class="m_10" placeholder="Enter Username" bind:value={username} required> <br>
        <input type="password" class="m_10" placeholder="Enter password" bind:value={password} required> <br>
        {#if wrong_credentials}
            <small class="m_10 red">Please enter correct credentials</small><br>
        {/if}
        <button type="submit" class="m_10" value="Login">Login</button>
    </form>
</div>

<style>
    #login_div{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      border: 1px solid black;
      border-radius: 5px;
    }

    .m_10{
      margin: 10px;
    }

    .red{
      color: red;
    }
</style>