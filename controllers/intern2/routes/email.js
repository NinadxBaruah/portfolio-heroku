const express = require('express');
const router = express.Router();
const emailController = require('../emailController');

// Get email layout template
router.get('/layout', emailController.getLayout);

// CRUD operations for email templates
router.post('/render', emailController.renderTemplate);
router.post('/download', emailController.downloadTemplate);
router.post('/templates', emailController.createTemplate);
router.get('/templates', emailController.getTemplates);
router.get('/templates/:id', emailController.getTemplateById);
router.put('/templates/:id', emailController.updateTemplate);
router.delete('/templates/:id', emailController.deleteTemplate);

module.exports = router;