<script>
    import { page } from '$app/stores';
    import {loginDetails,messageStore,roomDetails} from '../store/store.js';
    import { goto } from '$app/navigation';
    import "../app.scss";
    
    let pathname;

    $: pathname = $page.path;

    function logout(){
        sessionStorage.removeItem("loginDetails");
        sessionStorage.removeItem("RoomDetails");
        sessionStorage.removeItem("allmsgs");
        messageStore.set();
        roomDetails.set();
        loginDetails.set();
        goto('/');
    }
</script>

{#if pathname != '/'}
    <div class="topbar">
        <span on:click|once={logout}>Logout</span>
    </div>
{/if}