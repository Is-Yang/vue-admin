<template>
  <div class="org-manage">
    <el-container>
      <org-tree></org-tree>

      <el-container style="width:100%;" class="padding-left-15">
        <user-list></user-list>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import OrgTree from './OrgTree';
  import UserList from './user/UserList';
  export default {
    components: {
      OrgTree,
      UserList
    },
  }

</script>
