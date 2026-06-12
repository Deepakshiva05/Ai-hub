import logging
from pymongo import MongoClient
from . import config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_hub_premium.database")

class MemoryCollection:
    def __init__(self, name):
        self.name = name
        self.data = []
        self._id_counter = 1

    def insert_one(self, document):
        doc = dict(document)
        if "_id" not in doc:
            doc["_id"] = f"mock_{self._id_counter}"
            self._id_counter += 1
        self.data.append(doc)
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(doc["_id"])

    def find(self, query=None, sort=None, limit=0):
        results = list(self.data)
        if query:
            filtered = []
            for doc in results:
                match = True
                for k, v in query.items():
                    if isinstance(v, dict):
                        # Simple support for operators like $gt, $lt, $in
                        doc_val = doc.get(k)
                        for op, op_val in v.items():
                            if op == "$in" and doc_val not in op_val:
                                match = False
                            elif op == "$gt" and not (doc_val > op_val):
                                match = False
                            elif op == "$lt" and not (doc_val < op_val):
                                match = False
                    else:
                        if doc.get(k) != v:
                            match = False
                            break
                if match:
                    filtered.append(doc)
            results = filtered
        
        if sort:
            # Sort is usually a list of tuples: [("created_at", -1)]
            for field, order in reversed(sort):
                # We handle potential None/missing fields gracefully
                results = sorted(results, key=lambda x: x.get(field) or "", reverse=(order == -1))
        
        if limit > 0:
            results = results[:limit]
            
        return results

    def find_one(self, query):
        results = self.find(query)
        return results[0] if results else None

    def update_one(self, query, update):
        doc = self.find_one(query)
        if doc and "$set" in update:
            for k, v in update["$set"].items():
                doc[k] = v
            class UpdateResult:
                def __init__(self, modified_count):
                    self.modified_count = modified_count
            return UpdateResult(1)
        
        class UpdateResult:
            def __init__(self, modified_count):
                self.modified_count = 0
        return UpdateResult(0)

class MemoryDatabase:
    def __init__(self):
        self.collections = {}

    def __getitem__(self, name):
        if name not in self.collections:
            self.collections[name] = MemoryCollection(name)
        return self.collections[name]

db = None
is_mock = False

try:
    if config.MONGODB_URL and not config.MONGODB_URL.startswith("mongodb+srv://username:password"):
        client = MongoClient(config.MONGODB_URL, serverSelectionTimeoutMS=2000)
        # Test connection
        client.admin.command('ping')
        db = client[config.DATABASE_NAME]
        logger.info("Connected to MongoDB successfully!")
    else:
        logger.warning("No valid MONGODB_URL configured. Using local in-memory fallback database.")
        db = MemoryDatabase()
        is_mock = True
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}. Falling back to in-memory database.")
    db = MemoryDatabase()
    is_mock = True

def get_db():
    return db

def is_db_mocked():
    return is_mock
