<script setup>
import { ref, watch } from 'vue'
import { codeLogin } from '@/api/login'
import { codeRegist } from '@/api/regist'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
let isRegister = ref(false)
const router = useRouter()
const userStore = useUserStore()
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
const rules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 1, max: 10, message: '请输入正确的账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6}$/,
      message: '密码不符合规则',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const form = ref()
const register = async () => {
  try {
    const isValid = await form.value.validate()
    if (!isValid) {
      ElMessage.error('验证失败，请检查输入')
      return
    }

    // 执行登录请求，并捕获请求中的任何异常
    const response = await codeRegist(
      formModel.value.username,
      formModel.value.password
    )
    console.log('response', response)

    // 检查响应状态是否为 200
    if (response.code === 200) {
      ElMessage.success(response.message || '注册成功')
      setInterval(() => {
        isRegister.value = false
      }, 1000)
    } else {
      // 若 code 不为 200，则显示错误消息
      // console.log(response);
      ElMessage.error(response.error || '注册失败')
    }
  } catch (error) {
    // 捕获任何未捕获的错误，并显示错误信息
    console.log('error', error)

    ElMessage.error(`请求失败：${error.message || '请稍后重试'}`)
    console.error('注册过程中的错误:', error)
    console.error('错误的详细信息:', JSON.stringify(error))
  }
}
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

const login = async () => {
  try {
    const isValid = await form.value.validate()
    if (!isValid) {
      ElMessage.error('验证失败，请检查输入')
      return
    }

    // 执行登录请求，并捕获请求中的任何异常
    const response = await codeLogin(
      formModel.value.username,
      formModel.value.password
    )
    // console.log(response)
    // 检查响应状态是否为 200
    if (response.code === 200) {
      // console.log('response.data', response.data)

      const token = response.data.token
      // 将 token 和 userId 存储在 localStorage 中
      //console.log(token);

      userStore.setToken(token)
      userStore.setUserId(response.data.userId)
      // 显示成功消息并导航到首页
      ElMessage.success(response.message || '登录成功')
      router.push('/')
    } else {
      // 若 code 不为 200，则显示错误消息
      ElMessage.error(response.message || '登录失败')
    }
  } catch (error) {
    // 捕获任何未捕获的错误，并显示错误信息
    ElMessage.error(`请求失败：${error.message || '请稍后重试'}`)
    console.error('登录过程中的错误:', error)
    console.error('错误的详细信息:', JSON.stringify(error))
  }
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" :offset="6" class="form">
      <el-form
        :rules="rules"
        :model="formModel"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped>
.login-page {
  padding-top: 150px;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
  .title {
    margin: 0 auto;
  }
  .button {
    width: 100%;
  }
  .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
