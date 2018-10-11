<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>    
      <el-table-column label="Alarm ID" width="100">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="Alarm Name" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Alarmname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="TimeStamp" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.TimeStamp}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Camera Name" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.CamName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="AlarmDescription" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.AlarmDescription}}</span>
        </template>
      </el-table-column>
      <el-table-column label="AlarmImage" width="200" align="center">
        <template slot-scope="scope">
          <img v-bind:src="'http://'+scope.row.AlarmSourceVAS+'/Alarms/'+scope.row.ImageFile" alt="thumbnail" width="128" height="96" /> 
        </template>
      </el-table-column>    
     <!--  <el-table-column label="AlarmVideo" width="200" align="center">
        <template slot-scope="scope">
          <img v-bind:src="'http://127.0.0.1:5000/stream?url=http://'+scope.row.AlarmSourceVAS+'/Alarms/'+scope.row.VideoFile" alt="video" width="128" height="96" /> 
       </template>
      </el-table-column>   -->
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import { getAlarms } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAlarms().then(response => {
        this.list = response
        console.log(this.list);
        this.listLoading = false
      }).catch(e => {
    console.log(e);
    this.tlistLoading = false;
});
    }
  }
}
</script>
