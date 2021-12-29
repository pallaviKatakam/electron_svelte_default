<script>
    import { onMount } from 'svelte';
    import {messageStore, sendMessage, leaveRoomDetails,roomDetails} from '../store/store.js';
    import { goto } from '$app/navigation';
    let msg = '';
    let messages = [];
    let login_details = {};
    let room_name = '';
    let leaveUserData = '';
    let someoneleft = false;

    onMount(() => {

        if(sessionStorage.getItem('allmsgs')){
            messages = JSON.parse(sessionStorage.getItem('allmsgs'));
            // console.log(messages);
        }
        
        if(sessionStorage.getItem('loginDetails')){
            login_details = JSON.parse(sessionStorage.getItem('loginDetails'));
        }else{
            goto('/');
        }

        if(sessionStorage.getItem('RoomDetails')){
            let room_details = JSON.parse(sessionStorage.getItem('RoomDetails'));
            room_name = room_details.room;
        }

        if(sessionStorage.getItem('RoomDetails') && !sessionStorage.getItem('allmsgs')){
            let room_details = JSON.parse(sessionStorage.getItem('RoomDetails'));

            if(room_details.createRoom){
                messages = [...messages, room_details];  
                sessionStorage.setItem('allmsgs', JSON.stringify(messages)) 
            }
        }

        messageStore.subscribe(msgDetails => {
            if(msgDetails){
                let message = JSON.parse(msgDetails);
                messages = [...messages, message];
                sessionStorage.setItem('allmsgs', JSON.stringify(messages))
            }
        })
    })

    function Message(){
        sendMessage({'action':'sendMessage','sentby':login_details['username'], 'text':msg, 'room': room_name});
        msg = '';
    }

    function leaveRoom() {
        sendMessage({'action':'leaveRoom', 'username':login_details['username'], 'roomname':room_name});
    }

    leaveRoomDetails.subscribe(leaveData => {
        if(leaveData){
            leaveUserData = JSON.parse(leaveData);
            console.log(leaveUserData);
            someoneleft = true;
        }
    })

    $ : if(someoneleft){
            if(leaveUserData.username == login_details['username']){
                leaveUserData = '';
                roomDetails.set();
                messageStore.set();
                leaveRoomDetails.set();
                sessionStorage.removeItem("allmsgs");
                sessionStorage.removeItem("RoomDetails");
                goto('/room');
            }else if(leaveUserData && leaveUserData.username != login_details['username']){
                messages = [...messages, leaveUserData];
                sessionStorage.setItem('allmsgs', JSON.stringify(messages))
                leaveRoomDetails.set();
            }
            someoneleft = false;
        }

</script>

<svelte:head>
    <title>Send Message</title>
</svelte:head>

<button on:click={()=>leaveRoom()} id="leave_btn" value="leave">Leave Room</button>

<div id="msg_div">
    <form on:submit|preventDefault={() => Message(msg)}>
        <input type="text" class="m_10" placeholder="Enter message" bind:value={msg} required> <br>
        <button type="submit" class="m_10" value="Send">Send</button>
    </form>
</div>

<div>
    {#each messages as message}
        {#if message.action == 'sendMessage'}
            <p>{message.sentby} : {message.text}</p>
        {:else if message.action == 'joinRoom'}
            <p class="room_create">{message.room} Room Created</p>
        {:else}
            <p class="leave_room">{message.username} Left Room</p>
        {/if}
    {/each}
</div>


<style>
    #msg_div{
      height: 100px;
      width: 200px;
      border: 1px solid black;
      border-radius: 5px;
      margin-top: 100px;
    }

    .m_10{
      margin: 10px;
    }

    #leave_btn{
        float: right;
    }

    .room_create{
        color: #B2BEB5;
    }

    .leave_room{
        color: red;
    }
</style>