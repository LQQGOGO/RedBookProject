<script setup>
import { computed, ref } from 'vue'
import {
  ElButton,
  ElDialog,
  ElInput,
  ElOption,
  ElProgress,
  ElSelect,
  ElTabPane,
  ElTabs,
  ElUpload,
  ElMessage
} from 'element-plus'
import { Plus, Picture, VideoCamera, Close } from '@element-plus/icons-vue'
import { uploadImage } from '@/api/uploadImage'
import { uploadVideo } from '@/api/uploadVideo'
import { publish } from '@/api/publish'
import { useUserStore } from '@/stores/user'
import { getImageSize } from '@/utils/getImageSize'
import defaultCover from '@/assets/cover.jpg'
import { useRouter } from 'vue-router'

const categoryOptions = [
  { label: '美食', value: 'food' },
  { label: '穿搭', value: 'fashion' },
  { label: '美妆', value: 'cosmetics' },
  { label: '家居', value: 'household' },
  { label: '游戏', value: 'game' },
  { label: '旅行', value: 'travel' },
  { label: '摄影', value: 'photography' },
  { label: '职场', value: 'career' },
  { label: '健身', value: 'fitness' },
  { label: '情感', value: 'love' },
  { label: '其他', value: 'other' }
]

const router = useRouter()
const activeTab = ref('imageText')
const imageFileList = ref([])
const videoFileList = ref([])
const coverFileList = ref([])
const previewDialogVisible = ref(false)
const previewImageUrl = ref('')
const title = ref('')
const content = ref('')
const selectedCategory = ref('')
const videoUploadProgress = ref(0)
const videoHashProgress = ref(0)
const isUploadingVideo = ref(false)
const isPublishing = ref(false)

const mediaType = computed(() => (activeTab.value === 'imageText' ? 0 : 1))
const canPublish = computed(() => {
  const hasMedia =
    mediaType.value === 0
      ? imageFileList.value.length > 0
      : videoFileList.value.length > 0
  return (
    title.value.trim() &&
    content.value.trim() &&
    selectedCategory.value &&
    hasMedia &&
    !isUploadingVideo.value &&
    !isPublishing.value
  )
})

const currentCover = computed(() => {
  if (mediaType.value === 0) return imageFileList.value[0]
  return coverFileList.value[0] || imageFileList.value[0]
})

const handleImageUpload = async file => {
  try {
    const formData = new FormData()
    formData.append('image', file.file)
    const response = await uploadImage(formData)
    imageFileList.value.push({ name: file.file.name, url: response.url })
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败')
  }
}

const handleCoverUpload = async file => {
  try {
    const formData = new FormData()
    formData.append('image', file.file)
    const response = await uploadImage(formData)
    coverFileList.value = [{ name: file.file.name, url: response.url }]
  } catch (error) {
    console.error('封面上传失败:', error)
    ElMessage.error('封面上传失败')
  }
}

const handlePreview = file => {
  previewImageUrl.value = file.url
  previewDialogVisible.value = true
}

const handleImageRemove = file => {
  imageFileList.value = imageFileList.value.filter(item => item.url !== file.url)
}

const handleCoverRemove = () => {
  coverFileList.value = []
}

const handleVideoUpload = async file => {
  try {
    isUploadingVideo.value = true
    videoUploadProgress.value = 0
    videoHashProgress.value = 0
    const formData = new FormData()
    formData.append('video', file.file)
    const response = await uploadVideo(
      formData,
      progress => {
        videoUploadProgress.value = Math.min(100, Math.round(progress))
      },
      progress => {
        videoHashProgress.value = Math.min(100, Math.round(progress))
      }
    )
    videoFileList.value = [{ name: file.file.name, url: response.url }]
    ElMessage.success('视频上传成功')
  } catch (error) {
    console.error('视频上传失败:', error)
    ElMessage.error('视频上传失败')
  } finally {
    isUploadingVideo.value = false
  }
}

const handleVideoRemove = () => {
  videoFileList.value = []
  videoUploadProgress.value = 0
  videoHashProgress.value = 0
}

const resetForm = () => {
  title.value = ''
  content.value = ''
  selectedCategory.value = ''
  imageFileList.value = []
  videoFileList.value = []
  coverFileList.value = []
  videoUploadProgress.value = 0
  videoHashProgress.value = 0
}

const handlePublish = async () => {
  if (!canPublish.value) {
    ElMessage.error('请补全发布内容')
    return
  }

  try {
    isPublishing.value = true
    const mediaUrls = JSON.stringify(
      mediaType.value === 0 ? imageFileList.value : videoFileList.value
    )
    const cover = currentCover.value || { url: defaultCover }
    const coverSize = await getImageSize(cover.url)
    const userStore = useUserStore()
    const data = {
      userId: userStore.userId,
      title: title.value.trim(),
      content: content.value.trim(),
      mediaType: mediaType.value,
      mediaUrls,
      cover: cover.url,
      coverWidth: coverSize.width,
      coverHeight: coverSize.height,
      category: selectedCategory.value
    }
    const res = await publish(data)
    if (res.code === 200) {
      ElMessage.success('发布成功')
      resetForm()
      router.push('/')
    } else {
      ElMessage.error(res.message || '发布失败')
    }
  } catch (error) {
    console.error('发布失败:', error)
    ElMessage.error('发布失败，请稍后重试')
  } finally {
    isPublishing.value = false
  }
}
</script>

<template>
  <div class="publish-page">
    <section class="publish-shell">
      <header class="publish-header">
        <div>
          <h1>发布笔记</h1>
          <p>分享你的灵感、体验和生活瞬间</p>
        </div>
        <el-button
          class="publish-action"
          type="danger"
          :loading="isPublishing"
          :disabled="!canPublish"
          @click="handlePublish"
        >
          发布
        </el-button>
      </header>

      <div class="publish-workspace">
        <section class="media-panel">
          <el-tabs v-model="activeTab" class="publish-tabs">
            <el-tab-pane label="发布图文" name="imageText" />
            <el-tab-pane label="上传视频" name="video" />
          </el-tabs>

          <div v-if="activeTab === 'imageText'" class="media-section">
            <el-upload
              class="image-uploader"
              :http-request="handleImageUpload"
              :multiple="true"
              :limit="8"
              :on-preview="handlePreview"
              :on-remove="handleImageRemove"
              :file-list="imageFileList"
              accept="image/*"
              list-type="picture-card"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>

          <div v-else class="media-section">
            <div v-if="videoFileList.length" class="video-preview">
              <video :src="videoFileList[0].url" controls />
              <button class="remove-media" @click="handleVideoRemove">
                <el-icon><Close /></el-icon>
              </button>
            </div>

            <el-upload
              v-else
              class="video-uploader"
              :http-request="handleVideoUpload"
              :show-file-list="false"
              :limit="1"
              accept="video/*"
            >
              <div class="upload-empty">
                <el-icon><VideoCamera /></el-icon>
                <span>选择视频</span>
              </div>
            </el-upload>

            <div v-if="isUploadingVideo" class="upload-progress">
              <div>
                <span>Hash</span>
                <el-progress :percentage="videoHashProgress" />
              </div>
              <div>
                <span>Upload</span>
                <el-progress :percentage="videoUploadProgress" />
              </div>
            </div>

            <div class="cover-block">
              <div class="section-title">封面</div>
              <div v-if="coverFileList.length" class="cover-preview">
                <img :src="coverFileList[0].url" alt="" />
                <button class="remove-media" @click="handleCoverRemove">
                  <el-icon><Close /></el-icon>
                </button>
              </div>
              <el-upload
                v-else
                class="cover-uploader"
                :http-request="handleCoverUpload"
                :show-file-list="false"
                accept="image/*"
              >
                <div class="cover-empty">
                  <el-icon><Picture /></el-icon>
                  <span>选择封面</span>
                </div>
              </el-upload>
            </div>
          </div>
        </section>

        <section class="editor-panel">
          <div class="field-group">
            <label>标题</label>
            <el-input
              v-model="title"
              class="title-input"
              placeholder="填写标题会有更多赞哦"
              maxlength="20"
              show-word-limit
            />
          </div>

          <div class="field-group">
            <label>正文</label>
            <el-input
              v-model="content"
              class="content-input"
              type="textarea"
              placeholder="输入正文描述，真诚有价值的分享予人温暖"
              maxlength="1000"
              show-word-limit
              resize="none"
            />
          </div>

          <div class="field-group">
            <label>分类</label>
            <el-select
              v-model="selectedCategory"
              class="category-select"
              placeholder="选择分类"
            >
              <el-option
                v-for="category in categoryOptions"
                :key="category.value"
                :label="category.label"
                :value="category.value"
              />
            </el-select>
          </div>
        </section>
      </div>
    </section>

    <el-dialog v-model="previewDialogVisible" title="图片预览">
      <img :src="previewImageUrl" alt="" class="preview-image" />
    </el-dialog>
  </div>
</template>

<style scoped>
.publish-page {
  min-height: calc(100vh - 72px);
  padding: 28px 36px 44px;
  background: #f7f7f8;
}

.publish-shell {
  max-width: 1180px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #ececef;
  border-radius: 8px;
}

.publish-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid #f0f0f2;
}

.publish-header h1 {
  margin: 0;
  font-size: 24px;
  color: #111;
}

.publish-header p {
  margin: 8px 0 0;
  font-size: 14px;
  color: #8a8a8f;
}

.publish-action {
  min-width: 104px;
  border-radius: 6px;
  font-weight: 600;
}

.publish-workspace {
  display: grid;
  grid-template-columns: minmax(420px, 1.05fr) minmax(360px, 0.95fr);
  min-height: 640px;
}

.media-panel {
  padding: 24px 28px 28px;
  border-right: 1px solid #f0f0f2;
}

.editor-panel {
  padding: 38px 32px;
}

.publish-tabs {
  margin-bottom: 18px;
}

.media-section {
  min-height: 520px;
}

:deep(.image-uploader .el-upload--picture-card),
.video-uploader,
.cover-uploader {
  border-radius: 8px;
  border-color: #dedee3;
  background: #fafafa;
}

:deep(.image-uploader .el-upload-list--picture-card .el-upload-list__item) {
  border-radius: 8px;
}

.video-uploader {
  width: 100%;
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dedee3;
  cursor: pointer;
}

.upload-empty,
.cover-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #777;
}

.upload-empty .el-icon {
  font-size: 44px;
  color: #c4c4ca;
}

.cover-empty .el-icon {
  font-size: 28px;
  color: #c4c4ca;
}

.video-preview {
  position: relative;
  width: 100%;
  height: 360px;
  overflow: hidden;
  border-radius: 8px;
  background: #111;
}

.video-preview video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.remove-media {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  cursor: pointer;
}

.upload-progress {
  display: grid;
  gap: 12px;
  padding: 16px 2px 4px;
  color: #777;
  font-size: 13px;
}

.cover-block {
  margin-top: 24px;
}

.section-title,
.field-group label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #222;
}

.cover-uploader,
.cover-preview {
  position: relative;
  width: 168px;
  height: 112px;
  overflow: hidden;
  border-radius: 8px;
}

.cover-uploader {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dedee3;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.field-group {
  margin-bottom: 28px;
}

.title-input,
.category-select {
  width: 100%;
}

.content-input :deep(.el-textarea__inner) {
  min-height: 260px !important;
  line-height: 1.7;
}

.preview-image {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 960px) {
  .publish-page {
    padding: 16px;
  }

  .publish-header {
    gap: 16px;
    align-items: flex-start;
    flex-direction: column;
  }

  .publish-workspace {
    grid-template-columns: 1fr;
  }

  .media-panel {
    border-right: 0;
    border-bottom: 1px solid #f0f0f2;
  }

  .editor-panel {
    padding: 24px 28px 32px;
  }
}
</style>
