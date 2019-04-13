<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<style lang="scss">
    @import "assets/css/common";

    #app {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: $bg-color;
    }

    ::-webkit-scrollbar {
        width: 0;
        display: none;
    }
</style>
