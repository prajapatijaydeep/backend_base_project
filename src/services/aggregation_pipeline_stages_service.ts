export const getUserSearchStage = (search: string) => {
  return [
    {
      $search: {
        index: "user_search_index",
        compound: {
          should: [
            "userName",
            "generalInfo.firstName",
            "generalInfo.lastName",
          ].map((key, index) => {
            return {
              autocomplete: {
                query: search,
                path: key,
                fuzzy: {
                  maxEdits: 1,
                },
              },
            };
          }),
        },
      },
    },
    {
      $addFields: {
        searchScore: { $meta: "searchScore" },
      },
    },
  ];
};
