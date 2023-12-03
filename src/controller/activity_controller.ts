import { activityModel } from "../models";
import { activitySchema } from "../utils/validation/validation_schema";

async function addToActivity(data: any) {
  try {
    await activityModel.create(data);
    return;
  } catch (error) {
    throw error;
  }
}

async function deleteFromActivity(postId: string, session) {
  try {
    await activityModel.deleteMany(
      {
        $or: [{ actionId: postId }, { postId: postId }],
      },
      { session }
    );
    return;
  } catch (error) {
    throw error;
  }
}

async function getActivity(req, res, next) {
  try {
    const reqData = req.query;
    const validatedData = await activitySchema.validateAsync(reqData);

    const { lastDocId, limit } = validatedData;

    const skip = validatedData.page ? (validatedData.page - 1) * limit : 0;

    // find activity by userId
    const activityData = await activityModel
      .find(
        {
          userId: validatedData.userId,
          activityType: { $ne: "OFFER_NOTIFICATION" },
          ...(lastDocId && { _id: { $lt: lastDocId } }),
        },
        {
          activityId: "$_id",
          userId: 1,
          activity: 1,
          action: 1,
          generationDetails: 1,
          activityType: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 0,
        }
      )
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.dataFetchSuccess({
      data: activityData,
    });
  } catch (error) {
    next(error);
  }
}

export { getActivity, addToActivity, deleteFromActivity };
