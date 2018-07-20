import Mock from 'mockjs';
Mock.setup({ timeout: '1000-2000' });
const Random = Mock.Random;
Mock.mock('/login',{
  success: true,
  data: true
})