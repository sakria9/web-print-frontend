<template>
  <el-upload
    class="upload-pdf"
    ref="upload"
    drag
    action=""
    :auto-upload="false"
    :http-request="onUpload"
    :limit="1"
    :on-change="handleChange"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
  </el-upload>
  <el-button
    class="margin-top"
    type="primary"
    @click="createTask"
    :disabled="!pdfFile"
    >New Task</el-button
  >
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import {
  genFileId,
  UploadFile,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  ElMessage,
} from "element-plus";
import { useTaskStore } from "~/stores/task";
const { get } = useTaskStore();

const onUpload = async () => {
  console.log("onUpload");
  return true;
};

const upload = ref<UploadInstance>();
const pdfFile = ref<UploadFile>();

const handleChange: UploadProps["onChange"] = (file, fileList) => {
  pdfFile.value = file;
};
const handleRemove: UploadProps["onRemove"] = (file, fileList) => {
  pdfFile.value = undefined;
};
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
const createTask = async () => {
  if (pdfFile?.value?.raw == undefined) {
    return;
  }
  let formData = new FormData();
  formData.append("file", pdfFile.value.raw);
  formData.append("name", pdfFile.value.name);
  const result = await fetch("/api/task/create", {
    method: "POST",
    body: formData,
  });
  if (result.ok) {
    upload.value!.clearFiles();
    pdfFile.value = undefined;
    await get();
  } else {
    try {
      const data = await result.json();
      ElMessage.error(`Failed to create task: ${data.error}`);
    } catch (e) {
      ElMessage.error("Failed to create task");
    }
  }
};
</script>
