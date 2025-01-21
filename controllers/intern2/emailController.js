const EmailTemplate = require('../../db/EmailTemplate');
const fs = require('fs').promises;
const path = require('path');

const emailController = {
  async getLayout(req, res) {
    try {
      const layoutPath = path.join(__dirname, '../../public/templates/layout.html');
      const layout = await fs.readFile(layoutPath, 'utf8');
      res.send(layout);
    } catch (error) {
      res.status(500).json({ error: 'Error reading layout template' });
    }
  },

  async createTemplate(req, res) {
    try {
      const template = new EmailTemplate(req.body);
      console.log(template)
      const savedTemplate = await template.save();
      res.status(201).json(savedTemplate);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getTemplates(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const query = search 
        ? { title: new RegExp(search, 'i') }
        : {};

      const templates = await EmailTemplate.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const count = await EmailTemplate.countDocuments(query);

      res.json({
        templates,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTemplateById(req, res) {
    try {
      const template = await EmailTemplate.findById(req.params.id);
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateTemplate(req, res) {
    try {
      const template = await EmailTemplate.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      res.json(template);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteTemplate(req, res) {
    try {
      const template = await EmailTemplate.findByIdAndDelete(req.params.id);
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      res.json({ message: 'Template deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async renderTemplate(req, res) {
    try {
      const { template } = req.body;
      const layoutPath = path.join(__dirname, '../../public/templates/layout.html');
      let layoutHtml = await fs.readFile(layoutPath, 'utf8');

      // Replace template variables
      layoutHtml = layoutHtml.replace(/{{title}}/g, template.title || '');
      layoutHtml = layoutHtml.replace(/{{content}}/g, template.content || '');
      layoutHtml = layoutHtml.replace(/{{footer}}/g, template.footerText || '');
      
      // Replace image URL with absolute URL
      const imageUrl = template.imageUrl 
        ? `https://ninadbaruah.me${template.imageUrl}`
        : '';
      layoutHtml = layoutHtml.replace(/{{imageUrl}}/g, imageUrl);

      // Set headers for file download
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', 'attachment; filename=email-template.html');
      
      res.send(layoutHtml);
    } catch (error) {
      console.error('Error rendering template:', error);
      res.status(500).json({ error: 'Error rendering template' });
    }
  },

  async downloadTemplate(req, res) {
    try {
      const { template } = req.body;
      const layoutPath = path.join(__dirname, '../../public/templates/layout.html');
      let layoutHtml = await fs.readFile(layoutPath, 'utf8');

      const DEFAULT_FOOTER = `<p>&copy; 2025 Your Company. All rights reserved.</p>
        <p>Contact us: info@yourcompany.com</p>`;

      // Replace template variables with actual content
      layoutHtml = layoutHtml.replace(/{{title}}/g, template.title || '');
      layoutHtml = layoutHtml.replace(/{{content}}/g, template.content || '');
      layoutHtml = layoutHtml.replace(/{{footer}}/g, template.footerText || DEFAULT_FOOTER);

      // Replace image URL with absolute URL
      const imageUrl = template.imageUrl 
        ? `https://ninadbaruah.me${template.imageUrl}`
        : '';
      layoutHtml = layoutHtml.replace(/{{imageUrl}}/g, imageUrl);

      // Set response headers for file download
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', 'attachment; filename=email-template.html');

      res.send(layoutHtml);
    } catch (error) {
      console.error('Error generating template:', error);
      res.status(500).json({ error: 'Error generating template' });
    }
  }
};

module.exports = emailController;