class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const toAvoid = ["keyword", "page", "limit"];
    let queryStrCopy = { ...this.queryStr };

    toAvoid.forEach((key) => delete queryStrCopy[key]);
    
    if (queryStrCopy.category) {
      queryStrCopy.category = queryStrCopy.category.split(",");
    
      queryStrCopy.category = { $in: queryStrCopy.category };

    }
    else{
    delete queryStrCopy.category}
    queryStrCopy = JSON.stringify(queryStrCopy);
    queryStrCopy = queryStrCopy.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );
    queryStrCopy=JSON.parse(queryStrCopy)
    
    this.query = this.query.find(queryStrCopy);
    return this;
  }
  // pagination(rpp){
  //     const currPage = this.queryStr.page || 1
  //     const skip = rpp * (currPage-1)
  //     this.query = this.query.limit(rpp).skip(skip)
  //     return this
  // }
}

module.exports = { ApiFeatures };
