class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.originalQueryString = { ...queryString }; // preserve original query params before any modifications
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit', 'fields', 'q', 'minPrice', 'maxPrice'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Apply Mongoose operator syntax ($gte, $gt, $lte, $lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  priceRange() {
    if (this.originalQueryString.minPrice || this.originalQueryString.maxPrice) {
      const priceFilter = {};

      if (this.originalQueryString.minPrice) {
        priceFilter.$gte = Number(this.originalQueryString.minPrice);
      }

      if (this.originalQueryString.maxPrice) {
        priceFilter.$lte = Number(this.originalQueryString.maxPrice);
      }

      this.query = this.query.find({ price: priceFilter });
    }
    return this;
  }

  textSearch(field, searchTerm) {
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      this.query = this.query.find({ [field]: searchRegex });
    }
    return this;
  }
}

export default APIFeatures;
