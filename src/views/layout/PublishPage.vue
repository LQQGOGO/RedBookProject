<script setup>
import { ref, onMounted } from 'vue'
import {
  ElTabs,
  ElTabPane,
  ElUpload,
  ElDialog,
  ElInput,
  ElTag,
  ElButton,
  ElSelect,
  ElOption,
  ElMessage
} from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { uploadImage } from '@/api/uploadImage'
import { uploadVideo } from '@/api/uploadVideo'
import { publish } from '@/api/publish'
import { useUserStore } from '@/stores/user'
import { getImageSize } from '@/utils/getImageSize'
import defaultCover from '@/assets/cover.jpg'
import { useRouter } from 'vue-router'

// 模拟数据
const activityTopics = ['#勇闯游戏岛', '#flowfit', '#家是我的能量场']
const locationOptions = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' }
]
const collectionOptions = [
  { label: '旅行合集', value: 'travel' },
  { label: '美食合集', value: 'food' }
]
const groupOptions = [
  { label: '爱好群', value: 'hobby' },
  { label: '学习群', value: 'study' }
]
const categoryOptions = [
  { label: '美食', value: 'food' },
  { label: '穿搭', value: 'fashion' },
  { label: '美妆', value: 'beauty' },
  { label: '家居', value: 'home' },
  { label: '宠物', value: 'pet' },
  { label: '旅行', value: 'travel' },
  { label: '摄影', value: 'photography' },
  { label: '其他', value: 'other' }
]
const router = useRouter()
const activeTab = ref('imageText')
// 图文上传相关
const imageFileList = ref([])
const previewDialogVisible = ref(false)
const previewImageUrl = ref('')
const title = ref('')
const content = ref('')
const selectedTags = ref([])
const selectedLocation = ref('')
const selectedCollection = ref('')
const selectedGroup = ref('')
const selectedCategory = ref('')

// 处理图片上传
const handleImageUpload = async file => {
  try {
    const formData = new FormData()
    formData.append('image', file.file)
    const response = await uploadImage(formData)
    console.log('response', response)
    imageFileList.value.push({
      url: response.url
    })
  } catch (error) {
    console.error('图片上传失败:', error)
  }
}

// 处理图片预览
const handlePreview = file => {
  previewImageUrl.value = file.url
  previewDialogVisible.value = true
}

// 处理图片移除
const handleRemove = (file, fileList) => {
  imageFileList.value = fileList
}

// 打开话题选择
const openTagSelect = () => {
  selectedTags.value.push('#示例话题')
}

// 移除已选话题
const handleTagClose = index => {
  selectedTags.value.splice(index, 1)
}

// 添加活动话题
const handleAddTopic = topic => {
  selectedTags.value.push(topic)
}

// 打开表情选择
const openEmojiSelect = () => {
  selectedTags.value.push('😄')
}

// 发布图文
const handlePublish = async () => {
  try {
    // 表单非空校验
    if (!title.value.trim()) {
      ElMessage.error('标题不能为空')
      return
    }
    if (!content.value.trim()) {
      ElMessage.error('正文不能为空')
      return
    }
    if (imageFileList.value.length === 0) {
      ElMessage.error('请至少上传一张图片')
      return
    }
    if (!selectedCategory.value) {
      ElMessage.error('请选择分类')
      return
    }
    const mediaType = activeTab.value === 'imageText' ? 0 : 1
    const mediaUrls = JSON.stringify(imageFileList.value)
    let cover = defaultCover
    if (mediaType === 0) {
      cover = imageFileList.value[0]
    } else {
      // 视频封面
    }
    // console.log('cover', cover)
    const coverSize = await getImageSize(cover.url)
    const userStore = useUserStore()
    const data = {
      userId: userStore.userId,
      title: title.value,
      content: content.value,
      mediaType: mediaType,
      mediaUrls: mediaUrls,
      cover: cover.url,
      coverWidth: coverSize.width,
      coverHeight: coverSize.height,
      category: selectedCategory.value
    }
    const res = await publish(data)
    // console.log('res', res)
    if (res.code === 200) {
      ElMessage.success('发布成功')
      router.push('/')
    } else {
      ElMessage.error('发布失败')
    }
  } catch (error) {
    console.error('发布失败:', error)
    ElMessage.error('发布失败，请稍后重试')
  }
}

// 暂存图文草稿
const handleSaveDraft = () => {
  console.log('暂存图文草稿：', {
    title: title.value,
    content: content.value,
    images: imageFileList.value,
    tags: selectedTags.value,
    location: selectedLocation.value,
    collection: selectedCollection.value,
    group: selectedGroup.value,
    category: selectedCategory.value
  })
}

//视频上传相关
const videoFileList = ref([])
const coverFileList = ref([])
const videoUrl = ref('')
const coverUrl = ref('')

// // 封面预览
// const handleCoverPreview = file => {
//   previewImageUrl.value = file.url
//   previewDialogVisible.value = true
// }

// // 封面移除
// const handleCoverRemove = (file, fileList) => {
//   coverFileList.value = fileList
//   coverUrl.value = fileList.length > 0 ? fileList[0].url : '' // 更新封面URL
// }

//上传视频
const handleVideoUpload = async file => {
  try {
    const formData = new FormData()
    formData.append('video', file.file)
    const response = await uploadVideo(formData)
    console.log('response', response)
    videoFileList.value.push({
      url: response.url
    })
  } catch (error) {
    console.error('视频上传失败:', error)
  }
}

// 处理视频预览（简单模拟，实际可结合视频预览组件）
const handleVideoPreview = file => {
  console.log('预览视频：', file)
}

// 处理视频移除
const handleVideoRemove = (file, fileList) => {
  videoFileList.value = fileList
}

// 发布视频
const handleVideoPublish = () => {
  console.log('发布视频内容：', {
    video: videoFileList.value
  })
  // 实际项目中调用后端视频上传接口
}

// 暂存视频草稿
const handleVideoSaveDraft = () => {
  console.log('暂存视频草稿：', {
    video: videoFileList.value
  })
}
</script>

<template>
  <div class="publish-page">
    <!-- 标签切换，区分图文和视频上传 -->
    <el-tabs v-model="activeTab" class="publish-tabs">
      <el-tab-pane label="发布图文" name="imageText"></el-tab-pane>
      <el-tab-pane label="上传视频" name="video"></el-tab-pane>
    </el-tabs>

    <!-- 图文发布部分 -->
    <div v-if="activeTab === 'imageText'" class="image-text-publish">
      <!-- 图片上传区域 -->
      <el-upload
        class="image-upload"
        :http-request="handleImageUpload"
        :multiple="true"
        :limit="8"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="imageFileList"
        list-type="picture-card"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="previewDialogVisible" title="图片预览">
        <img :src="previewImageUrl" alt="预览" class="preview-image" />
      </el-dialog>
    </div>

    <!-- 视频发布部分 -->
    <div v-else class="video-publish">
      <el-upload
        class="video-upload"
        :http-request="handleVideoUpload"
        :on-preview="handleVideoPreview"
        :on-remove="handleVideoRemove"
        :file-list="videoFileList"
        accept="video/*"
        :limit="1"
        list-type="text"
      >
        <el-button type="primary">上传视频</el-button>
      </el-upload>

      <!-- 封面上传区域 -->
      <div class="cover-upload-container">
        <h3 class="upload-title">视频封面</h3>
        <el-upload
          class="cover-upload"
          :http-request="handleImageUpload"
          :multiple="false"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="coverFileList"
          :limit="1"
          accept="image/*"
          list-type="picture-card"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <div class="cover-info">
          <p>封面建议：尺寸比例16:9，推荐分辨率1280×720px</p>
          <p>图片格式：支持JPG、PNG格式，文件大小不超过5MB</p>
        </div>
      </div>

      <div class="video-info">
        <p>视频大小：支持时长60分钟以内，最大20GB的视频文件</p>
        <p>视频格式：支持常用视频格式，推荐使用mp4、mov</p>
        <p>
          视频分辨率：推荐上传720P（1280*720）及以上视频，超过1080P的视频用网页端上传画质更清晰
        </p>
      </div>
      <!-- <div class="button-group">
        <el-button type="primary" @click="handleVideoPublish">发布</el-button>
        <el-button @click="handleVideoSaveDraft">暂存离开</el-button>
      </div> -->
    </div>
    <!-- 正文内容 -->
    <div>
      <el-input
        class="title-input"
        placeholder="填写标题会有更多赞哦~"
        v-model="title"
        maxlength="20"
        show-word-limit
      />
      <el-input
        class="content-input"
        type="textarea"
        placeholder="输入正文描述，真诚有价值的分享予人温暖"
        v-model="content"
        maxlength="1000"
        show-word-limit
      />

      <!-- 话题、用户、表情等选择（简单示例，可扩展） -->
      <div class="tags-section">
        <el-tag
          v-for="(tag, index) in selectedTags"
          :key="index"
          closable
          @close="handleTagClose(index)"
        >
          {{ tag }}
        </el-tag>
        <el-button type="text" @click="openTagSelect">选择话题</el-button>
        <el-select
          v-model="selectedCategory"
          placeholder="选择分类"
          class="user-select"
        >
          <el-option
            v-for="category in categoryOptions"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          />
        </el-select>
        <!-- 表情选择可结合第三方表情组件库，这里简单示例 -->
        <el-button type="text" @click="openEmojiSelect">选择表情</el-button>
      </div>

      <!-- 活动话题等（简单示例） -->
      <div class="activity-tags">
        <el-tag
          v-for="(topic, index) in activityTopics"
          :key="index"
          type="info"
          @click="handleAddTopic(topic)"
        >
          {{ topic }}
        </el-tag>
      </div>

      <!-- 其他选项：地点、合集、关联群聊（简单示例） -->
      <el-select
        v-model="selectedLocation"
        placeholder="添加地点"
        class="other-select"
      >
        <el-option
          v-for="loc in locationOptions"
          :key="loc.value"
          :label="loc.label"
          :value="loc.value"
        />
      </el-select>
      <el-select
        v-model="selectedCollection"
        placeholder="添加合集"
        class="other-select"
      >
        <el-option
          v-for="col in collectionOptions"
          :key="col.value"
          :label="col.label"
          :value="col.value"
        />
      </el-select>
      <el-select
        v-model="selectedGroup"
        placeholder="关联群聊"
        class="other-select"
      >
        <el-option
          v-for="grp in groupOptions"
          :key="grp.value"
          :label="grp.label"
          :value="grp.value"
        />
      </el-select>

      <!-- 操作按钮 -->
      <div class="button-group">
        <el-button type="primary" @click="handlePublish">发布</el-button>
        <el-button @click="handleSaveDraft">暂存离开</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.publish-page {
  padding: 20px;
}

.publish-tabs {
  margin-bottom: 20px;
}

.image-text-publish {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  gap: 16px;
}

.image-upload {
  width: 100%;
  min-height: 150px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
  text-align: center;
  cursor: pointer;
}

.preview-image {
  width: 100%;
  height: auto;
}

.title-input {
  width: 100%;
  margin-bottom: 15px;
}

.content-input {
  width: 100%;
  min-height: 100px;
}

.tags-section {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.activity-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.other-select {
  margin-right: 10px;
  margin-bottom: 15px;
}

.video-publish {
  display: flex;
  margin-bottom: 20px;
  flex-direction: column;
  gap: 16px;
}

.video-upload {
  width: 100%;
  min-height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-upload-container {
  margin: 20px 0;
  padding: 15px;
  border: 1px dashed #e6e6e6;
  border-radius: 4px;
}

.upload-title {
  margin-bottom: 15px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.cover-upload {
  margin-bottom: 10px;
}

.cover-info {
  font-size: 15px;
  color: #999;
  line-height: 1.5;
}

.cover-info p {
  margin: 5px 0;
}

.video-info {
  color: #999;
  font-size: 15px;
}

.button-group {
  display: flex;
  gap: 10px;
}
</style>
