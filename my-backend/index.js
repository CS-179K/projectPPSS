require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSanitizer = require('express-sanitizer');
const winston = require('winston');
const { body, validationResult, sanitizeBody } = require('express-validator');

const app = express();
const port = process.env.PORT || 5000;

// Logging configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(expressSanitizer());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(helmet());

// CSP configuration
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      childSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use('/api/', apiLimiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('MongoDB connected'))
.catch((err) => logger.error('Error connecting to MongoDB:', err));

// Define schemas and models
const filterSchema = new mongoose.Schema({
  contentType: String,
  industry: String,
  ageRange: String,
  interests: [String],
  gender: String,
  incomeLevel: String,
  tone: String,
  themes: [String],
  contentGoal: String,
  maxContentLength: String,
  language: String,
  isFavourite: { type: Boolean, default: false }
});

const Filter = mongoose.model("Filter", filterSchema);

const contentSchema = new mongoose.Schema({
  filters: {
    contentType: String,
    industry: String,
    ageRange: String,
    interests: [String],
    gender: String,
    incomeLevel: String,
    tone: String,
    themes: [String],
    contentGoal: String,
    maxContentLength: String,
    language: String,
  },
  prompt: String,
  response: String,
});

const GeneratedContent = mongoose.model("GeneratedContent", contentSchema);

// Define validation and sanitization rules for saveFilter endpoint
const filterValidationRules = [
  body('contentType').trim().escape(),
  body('industry').trim().escape(),
  body('ageRange').trim().escape(),
  body('interests').optional().isArray().customSanitizer(value => Array.isArray(value) ? value.map(item => item.trim().escape()) : []),
  body('gender').trim().escape(),
  body('incomeLevel').trim().escape(),
  body('tone').trim().escape(),
  body('themes').optional().isArray().customSanitizer(value => Array.isArray(value) ? value.map(item => item.trim().escape()) : []),
  body('contentGoal').trim().escape(),
  body('maxContentLength').trim().escape(),
  body('language').trim().escape()
];

// Endpoint to save filter data to the database with validation and sanitization
app.post("/api/saveFilter", filterValidationRules, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const filterData = new Filter(req.body);
    await filterData.save();
    res.status(201).send({ message: "Filter saved successfully!" });
  } catch (error) {
    logger.error('Failed to save filter data:', error);
    res.status(500).send({ error: "Failed to save filter data" });
  }
});

// Define validation and sanitization rules for save-content endpoint
const contentValidationRules = [
  body('filters.contentType').trim().escape(),
  body('filters.industry').trim().escape(),
  body('filters.ageRange').trim().escape(),
  body('filters.interests').optional().isArray().customSanitizer(value => Array.isArray(value) ? value.map(item => item.trim().escape()) : []),
  body('filters.gender').trim().escape(),
  body('filters.incomeLevel').trim().escape(),
  body('filters.tone').trim().escape(),
  body('filters.themes').optional().isArray().customSanitizer(value => Array.isArray(value) ? value.map(item => item.trim().escape()) : []),
  body('filters.contentGoal').trim().escape(),
  body('filters.maxContentLength').trim().escape(),
  body('filters.language').trim().escape(),
  body('prompt').trim().escape(),
  body('response').trim().escape()
];

// Endpoint to save generated content to the database with validation and sanitization
app.post("/api/save-content", contentValidationRules, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { filters, prompt, response } = req.body;

    // Create a new document using the GeneratedContent model
    const newContent = new GeneratedContent({
      filters,
      prompt,
      response,
    });

    // Save the document to the database
    await newContent.save();

    res.status(201).send({ message: "Content saved successfully!" });
  } catch (error) {
    logger.error('Failed to save content:', error);
    res.status(500).send({ error: "Failed to save content" });
  }
});

// Custom Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});
