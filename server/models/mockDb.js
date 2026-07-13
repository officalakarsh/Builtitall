const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeData = (collection, data) => {
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2), 'utf8');
};

// Dynamic helper to simulate Mongoose query results with chainable helper methods
const wrapResult = (item, collection) => {
  if (!item) return null;
  
  // Return a copy so we do not mutate the database record directly
  const wrapped = { ...item };
  
  wrapped.select = function() { return this; };
  wrapped.populate = function() {
    // If populating businessId inside bookings
    if (wrapped.businessId && typeof wrapped.businessId === 'string') {
      const businesses = readData('businesses');
      wrapped.businessId = businesses.find(b => b._id === wrapped.businessId) || wrapped.businessId;
    }
    return this;
  };
  wrapped.save = async function() {
    const items = readData(collection);
    const idx = items.findIndex(i => i._id === this._id);
    if (idx !== -1) {
      // Clean up helper methods before writing
      const toSave = { ...this };
      delete toSave.select;
      delete toSave.populate;
      delete toSave.save;
      delete toSave.matchPassword;
      items[idx] = toSave;
      writeData(collection, items);
    }
    return this;
  };
  
  if (collection === 'users') {
    wrapped.matchPassword = async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };
  }
  
  return wrapped;
};

// Mock Query Class mimicking Mongoose Query Builders (making them thenable)
class MockQuery {
  constructor(result, collection, isArray = false) {
    this.result = result;
    this.collection = collection;
    this.isArray = isArray;
  }

  select(fields) {
    // Return query for further chaining
    return this;
  }

  sort(options) {
    if (this.isArray && Array.isArray(this.result)) {
      if (options && typeof options === 'object') {
        const keys = Object.keys(options);
        if (keys.length > 0) {
          const key = keys[0];
          const direction = options[key]; // 1 or -1
          this.result.sort((a, b) => {
            const valA = a[key];
            const valB = b[key];
            if (valA < valB) return direction === 1 ? -1 : 1;
            if (valA > valB) return direction === 1 ? 1 : -1;
            return 0;
          });
        }
      } else if (typeof options === 'string') {
        let key = options;
        let direction = 1;
        if (options.startsWith('-')) {
          key = options.substring(1);
          direction = -1;
        }
        this.result.sort((a, b) => {
          const valA = a[key];
          const valB = b[key];
          if (valA < valB) return direction === 1 ? -1 : 1;
          if (valA > valB) return direction === 1 ? 1 : -1;
          return 0;
        });
      }
    }
    return this;
  }

  limit(n) {
    if (this.isArray && Array.isArray(this.result)) {
      this.result = this.result.slice(0, n);
    }
    return this;
  }

  skip(n) {
    if (this.isArray && Array.isArray(this.result)) {
      this.result = this.result.slice(n);
    }
    return this;
  }

  lean() {
    return this;
  }

  populate(fields) {
    if (this.isArray) {
      if (Array.isArray(this.result)) {
        this.result.forEach(item => {
          if (item && typeof item.populate === 'function') {
            item.populate(fields);
          }
        });
      }
    } else {
      if (this.result && typeof this.result.populate === 'function') {
        this.result.populate(fields);
      }
    }
    return this;
  }

  // Thenable interface supporting ES6 await
  then(onResolve, onReject) {
    let resolvedValue;
    if (this.isArray) {
      resolvedValue = Array.isArray(this.result) 
        ? this.result.map(item => wrapResult(item, this.collection))
        : [];
    } else {
      resolvedValue = wrapResult(this.result, this.collection);
    }
    return Promise.resolve(resolvedValue).then(onResolve, onReject);
  }
}

exports.MockUser = {
  findOne: (query) => {
    const users = readData('users');
    const user = users.find(u => u.email === query.email);
    return new MockQuery(user, 'users');
  },
  create: async (data) => {
    const users = readData('users');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newUser = {
      _id: 'user_' + Math.random().toString(36).substring(7),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'owner',
      subscription: { plan: 'free', status: 'active' },
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeData('users', users);
    return wrapResult(newUser, 'users');
  },
  findById: (id) => {
    const users = readData('users');
    const user = users.find(u => u._id === id);
    return new MockQuery(user, 'users');
  },
  findByIdAndUpdate: async (id, update) => {
    const users = readData('users');
    const idx = users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    
    let updated = { ...users[idx] };
    
    // Flat update matching the nested mongoose keys
    if (update['subscription.plan']) updated.subscription.plan = update['subscription.plan'];
    if (update['subscription.status']) updated.subscription.status = update['subscription.status'];
    if (update['subscription.stripeSubscriptionId'] !== undefined) {
      updated.subscription.stripeSubscriptionId = update['subscription.stripeSubscriptionId'];
    }
    if (update['subscription.currentPeriodEnd'] !== undefined) {
      updated.subscription.currentPeriodEnd = update['subscription.currentPeriodEnd'];
    }
    if (update.refreshToken !== undefined) updated.refreshToken = update.refreshToken;
    
    // Support normal object update
    if (update.subscription && typeof update.subscription === 'object') {
      updated.subscription = { ...updated.subscription, ...update.subscription };
    }
    
    users[idx] = updated;
    writeData('users', users);
    return wrapResult(updated, 'users');
  },
  findOneAndUpdate: async (query, update) => {
    const users = readData('users');
    let idx = -1;
    if (query && query['subscription.stripeSubscriptionId']) {
      const subId = query['subscription.stripeSubscriptionId'];
      idx = users.findIndex(u => u.subscription && u.subscription.stripeSubscriptionId === subId);
    } else if (query && query.email) {
      idx = users.findIndex(u => u.email === query.email);
    } else if (query && query._id) {
      idx = users.findIndex(u => u._id === query._id);
    }
    if (idx === -1) return null;
    
    let updated = { ...users[idx] };
    
    if (update['subscription.plan'] !== undefined) updated.subscription.plan = update['subscription.plan'];
    if (update['subscription.status'] !== undefined) updated.subscription.status = update['subscription.status'];
    if (update['subscription.stripeSubscriptionId'] !== undefined) {
      updated.subscription.stripeSubscriptionId = update['subscription.stripeSubscriptionId'];
    }
    if (update['subscription.currentPeriodEnd'] !== undefined) {
      updated.subscription.currentPeriodEnd = update['subscription.currentPeriodEnd'];
    }
    if (update.refreshToken !== undefined) updated.refreshToken = update.refreshToken;
    
    if (update.subscription && typeof update.subscription === 'object') {
      updated.subscription = { ...updated.subscription, ...update.subscription };
    }
    
    users[idx] = updated;
    writeData('users', users);
    return wrapResult(updated, 'users');
  }
};

exports.MockBusiness = {
  find: (query) => {
    let businesses = readData('businesses');
    if (query && query.ownerId) {
      businesses = businesses.filter(b => b.ownerId === query.ownerId.toString());
    }
    return new MockQuery(businesses, 'businesses', true);
  },
  findOne: (query) => {
    const businesses = readData('businesses');
    let biz;
    if (query.slug) biz = businesses.find(b => b.slug === query.slug);
    else if (query._id) biz = businesses.find(b => b._id === query._id);
    return new MockQuery(biz, 'businesses');
  },
  findById: (id) => {
    const businesses = readData('businesses');
    const biz = businesses.find(b => b._id === id);
    return new MockQuery(biz, 'businesses');
  },
  create: async (data) => {
    const businesses = readData('businesses');
    const newBiz = {
      _id: 'biz_' + Math.random().toString(36).substring(7),
      ...data,
      ownerId: data.ownerId ? data.ownerId.toString() : null,
      views: 0,
      bookingsCount: 0,
      createdAt: new Date().toISOString()
    };
    businesses.push(newBiz);
    writeData('businesses', businesses);
    return wrapResult(newBiz, 'businesses');
  },
  findByIdAndUpdate: async (id, update, options) => {
    const businesses = readData('businesses');
    const idx = businesses.findIndex(b => b._id === id);
    if (idx === -1) return null;
    
    const updated = { ...businesses[idx], ...update };
    businesses[idx] = updated;
    writeData('businesses', businesses);
    return wrapResult(updated, 'businesses');
  },
  findByIdAndDelete: async (id) => {
    const businesses = readData('businesses');
    const filtered = businesses.filter(b => b._id !== id);
    writeData('businesses', filtered);
    return { success: true };
  },
  countDocuments: async (query) => {
    const businesses = readData('businesses');
    if (query && query.ownerId) {
      return businesses.filter(b => b.ownerId === query.ownerId.toString()).length;
    }
    return businesses.length;
  }
};

exports.MockBooking = {
  find: (query) => {
    let bookings = readData('bookings');
    
    // Simulate complex business query
    if (query && query.businessId && query.businessId.$in) {
      const ids = query.businessId.$in.map(id => id.toString());
      bookings = bookings.filter(b => ids.includes(b.businessId));
    }
    
    return new MockQuery(bookings, 'bookings', true);
  },
  findById: (id) => {
    const bookings = readData('bookings');
    const booking = bookings.find(b => b._id === id);
    return new MockQuery(booking, 'bookings');
  },
  create: async (data) => {
    const bookings = readData('bookings');
    const newBooking = {
      _id: 'booking_' + Math.random().toString(36).substring(7),
      ...data,
      businessId: data.businessId ? data.businessId.toString() : null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    writeData('bookings', bookings);
    
    // Auto-update business booking counters
    try {
      const businesses = readData('businesses');
      const idx = businesses.findIndex(b => b._id === newBooking.businessId);
      if (idx !== -1) {
        businesses[idx].bookingsCount = (businesses[idx].bookingsCount || 0) + 1;
        writeData('businesses', businesses);
      }
    } catch (_) {}

    return wrapResult(newBooking, 'bookings');
  },
  findByIdAndUpdate: async (id, update, options) => {
    const bookings = readData('bookings');
    const idx = bookings.findIndex(b => b._id === id);
    if (idx === -1) return null;
    
    const updated = { ...bookings[idx], ...update };
    bookings[idx] = updated;
    writeData('bookings', bookings);
    return wrapResult(updated, 'bookings');
  }
};
