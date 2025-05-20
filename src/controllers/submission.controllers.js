'use strict'
const ServiceFactory = require('../patterns/serviceFactory')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

// Lấy service thông qua Factory Pattern
const submissionService = ServiceFactory.getService('submission')
const challengeService = ServiceFactory.getService('challenge')

class SubmissionController {
  async submitChallenge(req, res) {
    const { 
      challengeId, 
      code, 
      language 
    } = req.body
    
    const userId = req.user.id // Giả sử user ID đã được lưu trong req.user sau authentication
    
    // Trong thực tế, cần chạy code và kiểm tra kết quả ở đây
    // Đây chỉ là mô phỏng kết quả chạy code
    const challenge = await challengeService.findById(challengeId)
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' })
    }
    
    // Giả lập kết quả chạy code
    const simulationResult = this.simulateCodeExecution(code, language, challenge)
    
    // Tạo submission
    const submission = await submissionService.create({
      userId,
      challengeId,
      code,
      language,
      status: simulationResult.status,
      runtime: simulationResult.runtime,
      memory: simulationResult.memory,
      passedTestCases: simulationResult.passedTestCases,
      totalTestCases: simulationResult.totalTestCases
    })
    
    return new CREATED({
      message: 'Submission created successfully',
      metadata: submission
    }).send(res)
  }
  
  // Giả lập function chạy code và kiểm tra kết quả
  // Trong thực tế, bạn sẽ cần một hệ thống riêng để chạy code an toàn
  simulateCodeExecution(code, language, challenge) {
    // Giả lập kết quả
    // Trong thực tế, bạn sẽ cần một sandbox để chạy code và so sánh kết quả với testcases
    
    // Giả sử code có 70% khả năng pass tất cả các test cases
    const passRate = Math.random()
    const isFullyCorrect = passRate > 0.3
    
    const totalTestCases = challenge.testCases.length || 5
    const passedTestCases = isFullyCorrect 
      ? totalTestCases 
      : Math.floor(passRate * totalTestCases)
    
    return {
      status: isFullyCorrect ? 'Accepted' : 'Wrong Answer',
      runtime: Math.floor(Math.random() * 500), // 0-500ms
      memory: Math.floor(Math.random() * 10000 + 1000), // 1000-11000 KB
      passedTestCases,
      totalTestCases
    }
  }
  
  async getUserSubmissions(req, res) {
    const userId = req.user.id
    const { challengeId } = req.query
    
    const submissions = await require('../services/submission.services').getUserSubmissions(userId, challengeId)
    
    return new OK({
      message: 'User submissions retrieved successfully',
      metadata: submissions
    }).send(res)
  }
  
  async getBestSubmission(req, res) {
    const userId = req.user.id
    const { challengeId } = req.params
    
    const bestSubmission = await require('../services/submission.services').getBestSubmission(userId, challengeId)
    
    return new OK({
      message: 'Best submission retrieved successfully',
      metadata: bestSubmission
    }).send(res)
  }
  
  async getSubmissionById(req, res) {
    const { id } = req.params
    const submission = await submissionService.findById(id)
    
    return new OK({
      message: 'Submission retrieved successfully',
      metadata: submission
    }).send(res)
  }
}

module.exports = new SubmissionController()
