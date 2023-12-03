import Joi from "joi";

// ----------- COMMON SCHEMA -----------

const userIdRequireSchema = Joi.object({
  userId: Joi.string().trim().min(3).required(),
  lastDocId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("lastDocId must be an ObjectId"),
  limit: Joi.number().min(1).default(20),
});

// ----------- PUBLIC SCHEMA -----------

const userNameExistSchema = Joi.object({
  userName: Joi.string().min(4).max(30).trim().required(),
});

const verifyEmailProviderSchema = Joi.object({
  email: Joi.string().email().trim().required(),
});

// --------------- USER SCHEMA ----------

const addUserSchema = Joi.object({
  userId: Joi.string().trim().min(3).required(),
  userName: Joi.string().min(4).max(30).trim().required(),
  email: Joi.string().email().trim().required(),
  phone: Joi.string().min(6).max(30).trim().optional().allow(null),
  generalInfo: Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    profileImage: Joi.string().trim().optional().allow(null),
    bio: Joi.string().trim().optional().allow(null),
  }).required(),
});

const updateUserSchema = Joi.object({
  userId: Joi.string().trim().min(3).required(),
  generalInfo: Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    profileImage: Joi.string().trim().optional().allow(null),
    bio: Joi.string().trim().optional().allow(null),
  }).min(1),
  pushNotifications: Joi.object({
    pauseAllNotification: Joi.boolean(),
  }).min(1),
  userName: Joi.string().min(4).max(30).trim(),
}).or("generalInfo", "userName", "pushNotifications");

const addNotificationTokenSchema = Joi.object({
  userId: Joi.string().trim().min(3).required(),
  fcmToken: Joi.string().min(3).trim().required(),
});

// ------------- ACTIVITY SCHEMA ------------
const activitySchema = Joi.object({
  userId: Joi.string().trim().min(3).required(),
  page: Joi.number().integer().min(1),
  lastDocId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("lastDocId must be an ObjectId"),
  limit: Joi.number().min(1).default(20),
});

export {
  userNameExistSchema,
  verifyEmailProviderSchema,
  addUserSchema,
  userIdRequireSchema,
  updateUserSchema,
  addNotificationTokenSchema,
  activitySchema,
};
