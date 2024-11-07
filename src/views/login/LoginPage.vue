<script setup>
import { ref, watch } from 'vue'
import { codeLogin } from '@/api/login'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user'
const isRegister = ref(false)
const router = useRouter()
const userStore = useUserStore()
const formModel = ref({
  mobile: '',
  smsCode: '',
  resmsCode: ''
})
const rules = {
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  smsCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      pattern: /^\S{6}$/,
      message: '验证码不符合规则',
      trigger: 'blur'
    }
  ],
  resmsCode: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.smsCode) {
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
  await form.value.validate()

  //开始注册请求
}
watch(isRegister, () => {
  formModel.value = {
    mobile: '',
    smsCode: '',
    resmsCode: ''
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
    const response = await codeLogin(formModel.value.mobile, formModel.value.smsCode)
    // 检查响应状态是否为 200
    if (response.status === 200) {
      const token = response.data.data.token
      // 将 token 和 userId 存储在 localStorage 中
      //console.log(token);

      userStore.setToken(token)
      // 显示成功消息并导航到首页
      ElMessage.success(response.message || '登录成功')
      router.push('/')
    } else {
      // 若 status 不为 200，则显示错误消息
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
        <el-form-item prop="mobile">
          <el-input
            v-model="formModel.mobile"
            :prefix-icon="User"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="smsCode">
          <el-input
            v-model="formModel.smsCode"
            :prefix-icon="Lock"
            type="smsCode"
            placeholder="请输入验证码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="resmsCode">
          <el-input
            v-model="formModel.resmsCode"
            :prefix-icon="Lock"
            type="smsCode"
            placeholder="请输入再次验证码"
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
        <el-form-item prop="mobile">
          <el-input
            v-model="formModel.mobile"
            :prefix-icon="User"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="smsCode">
          <el-input
            v-model="formModel.smsCode"
            name="smsCode"
            :prefix-icon="Lock"
            type="smsCode"
            placeholder="请输入验证码"
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
