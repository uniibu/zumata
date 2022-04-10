<template>
  <div class="facts">
    <!-- Display the data with a structured table, element-ui is ready for use -->
    <el-row>
      <el-button
      type="success"
      @click="handleAdd">Add</el-button>
    </el-row>
    <el-table
    :data="facts"
    style="width: 100%">
    <el-table-column type="expand">
      <template v-slot="scope">
        <p>Created At: {{ scope.row.createdAt }}</p>
        <p>Id: {{ scope.row._id }}</p>
        <p>User: {{ scope.row.user }}</p>
        <p>Used: {{ scope.row.used }}</p>
        <p>Verified: {{ scope.row.status.verified }}</p>
        <p>Updated At: {{ scope.row.updatedAt }}</p>
        <p>Feedback: {{ scope.row.status.feedback }}</p>
      </template>
    </el-table-column>
    <el-table-column
      label="Description"
      width="400"
      prop="text">
    </el-table-column>
    <el-table-column
      label="Operations">
      <template v-slot="scope">
        <el-button
          size="default"
          @click="handleEdit(scope.row)">Edit</el-button>
        <el-button
          size="default"
          type="danger"
          @click="handleDelete(scope.row._id)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

export default {
  name: 'facts',
  setup() {
    const facts = ref([]);
    const parseDates = (response) => {
      const dateOpts = {
        year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',
      };
      let value = response.data;
      if (!Array.isArray(value)) {
        value = [value];
      }
      value = value.map((_list) => {
        // Avoiding Param-reassign
        const list = { ..._list };
        list.createdAt = new Date(list.createdAt).toLocaleDateString('en-US', dateOpts);
        list.updatedAt = new Date(list.updatedAt).toLocaleDateString('en-US', dateOpts);
        return list;
      });
      return value;
    };
    const getFacts = async () => {
      // Get data from backend
      let response;
      try {
        response = await axios.get('/getFacts');
      } catch (err) {
        console.log(err);
      }
      // Parse response.data and convert dates
      return parseDates(response);
    };
    const delFacts = async (id) => {
      // Post Id to backend for deletion
      let response;
      try {
        response = await axios.post('/deleteFacts', { id });
        // parse data and set the new value of facts
        facts.value = parseDates(response);
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
    const addFacts = async (text) => {
      // Post text to backend to add
      let response;
      try {
        response = await axios.post('/addFacts', { text });
        // parse data and set the new value of facts

        facts.value.push(parseDates(response)[0]);
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
    const updFacts = async (fact) => {
      // Post Id to backend for deletion
      let response;
      try {
        response = await axios.post('/updateFacts', fact);
        // parse data and set the new value of facts
        facts.value = parseDates(response);
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
    onMounted(async () => {
      facts.value = await getFacts();
      console.log(facts.value);
    });

    return {
      facts,
      delFacts,
      updFacts,
      addFacts,
    };
  },
  methods: {
    async handleAdd() {
      try {
        const { value } = await this.$prompt('Description', 'Add', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
        });
        await this.addFacts(value);
        this.$message({
          type: 'success',
          message: 'Successfully added!',
        });
      } catch (err) {
        this.$message({
          type: 'info',
          message: 'Canceled',
        });
      }
    },
    async handleDelete(id) {
      try {
        await this.$confirm('This will permanently delete the record. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        });
        await this.delFacts(id);
        this.$message({
          type: 'success',
          message: 'Delete completed',
        });
      } catch (err) {
        this.$message({
          type: 'info',
          message: 'Delete canceled',
        });
      }
    },
    async handleEdit(row) {
      try {
        const params = { ...row };
        const { value } = await this.$prompt('Description', 'Update', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          inputValue: params.text,
        });
        params.text = value;
        await this.updFacts(params);
        this.$message({
          type: 'success',
          message: 'Successfully updated!',
        });
      } catch (err) {
        this.$message({
          type: 'info',
          message: 'Update canceled',
        });
      }
    },
  },
  mounted() {
    console.log(this.facts.value);
  },
};

</script>
<style>
.facts {
    margin-left: auto;
    margin-right: auto;
    width: 50%
}
</style>
