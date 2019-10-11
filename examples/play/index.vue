<template>
  <section>
    <el-button @click="resetDateFilter">reset date filter</el-button>
    <el-button @click="clearFilter">reset all filters</el-button>
    <el-table
      ref="filterTable"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="Date"
        sortable
        width="180"
        column-key="date"
        :filters="[
        {
         type: 'checkbox-group',
         name: 'filter1',
         data: [
           {text: '2016-05-01', value: '2016-05-01'},
           {text: '2016-05-02', value: '2016-05-02'},
           {text: '2016-05-03', value: '2016-05-03'},
           {text: '2016-05-04', value: '2016-05-04'},
         ]
        },
        {
         type: 'input',
         name: 'filter2',
         data: {
            placeholder: 'This text input',
            size: 'medium',
         }
        },
        {
         type: 'date-range',
         name: 'filter3',
         data: {}
        },
        {
         type: 'input-range',
         name: 'filter4',
         data: {}
        },
        {
         type: 'slider-range',
         name: 'filter5',
         data: {
           step: 0.0001,
           min: 0,
           max: 1000
         }
        },
        {
         type: 'select',
         name: 'filter6',
         data: {
          options: [{
            value: '2016-05-01',
            label: '2016-05-01'
          }, {
            value: '2016-05-02',
            label: '2016-05-02'
          }, {
            value: '2016-05-03',
            label: '2016-05-03'
          }, {
            value: '2016-05-04',
            label: '2016-05-04'
          }],
         },
        }
      ]"
        :filter-remote-method="filterHandler"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="Address"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="Tag"
        width="100"
        :filters="[
          {
           type: 'checkbox-group',
           name: 'first',
           data: [
             {text: 'Home', value: 'Home'},
             {text: 'Office', value: 'Office'},
           ]
          }
        ]"
        :filter-remote-method="filterHandler"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.tag === 'Home' ? 'primary' : 'success'"
            disable-transitions>{{scope.row.tag}}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
          tag: 'Home',
        }, {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
          tag: 'Office',
        }, {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
          tag: 'Home',
        }, {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
          tag: 'Office',
        }],
    }
  },
  methods: {
    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(filter, column) {
      const property = column['property'];
    },
  },
}
</script>
