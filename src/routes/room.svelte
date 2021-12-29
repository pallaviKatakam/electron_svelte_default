<script>
    import { onMount } from 'svelte';
    import {roomDetails, createRoom}  from '../store/store.js';
    import { goto } from '$app/navigation';

    let roomname = '';
    let login_details = {};

    onMount(() => {

        if(sessionStorage.getItem('loginDetails')){
            login_details = JSON.parse(sessionStorage.getItem('loginDetails'));
        }else{
            goto('/');
        }

        roomDetails.subscribe(roomDetails => {
            if(roomDetails){
                let roomName ;
                roomName = JSON.parse(roomDetails);
                if(roomName.room != ''){
                    if(login_details['username'] == roomName.sentby)
                    sessionStorage.setItem('RoomDetails', roomDetails);
                    goto('/message');
                }
            }
        })
    })

    function roomdata(){
        createRoom({'action':'joinRoom','sentby':login_details['username'], 'text':'', 'room':roomname});
    }

    function create_file() {
        fs.writeFile('new_file.svelte','Hello World', function (err) {
            if(!err){
                console.log('file created');
            }
        })
    }
</script>

<svelte:head>
    <title>Join Room</title>
</svelte:head>

<button on:click={()=>create_file()}>Create Page</button>
<div id="room_div">
    <form on:submit|preventDefault={() => roomdata(roomname)}>
        <input type="text" class="m_10" placeholder="Enter room name" bind:value={roomname} required> <br>
        <button type="submit" class="m_10" value="createRoom">Create Room</button>
    </form>
</div>


<style>
    #room_div{
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
</style>