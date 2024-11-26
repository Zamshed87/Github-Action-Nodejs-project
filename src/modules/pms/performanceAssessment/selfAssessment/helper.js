/**
 * Description: This function will modify the data receiving from api.
 * Parameters:
 *   - : Data object received from api
 * Returns: Modified data array of question
 */

export const getModifiedData = (data) => {
  let hashedData = {};
  let modifiedDataArr = [];
  data.questionList.forEach((q) => {
    /**additional update for fixing a backend issue for now [BackEend's request]. but in future this might not need*/
    q.questionHeaderId = q.intQuestionreHeaderId;
    /** additional change ends */

    if (!hashedData[q.groupName]) {
      hashedData[q.groupName] = [];
    }
    hashedData[q.groupName] = [
      ...hashedData[q.groupName],
      {
        ...q,
      },
    ];
  });

  //key in object
  for (let group in hashedData) {
    modifiedDataArr.push({
      groupName: group,
      questions: hashedData[group],
    });
  }

  // console.log(hashedData)
  // console.log(modifiedDataArr)
  return modifiedDataArr;
};
