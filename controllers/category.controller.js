const Category = require('../models/category.model');

// Controller function to get all categories
const listCategories = async (req, res, next) => {
    try {
        const {
            name,
            description,
            parentId,
            disabled,
            is_inactive,
            page,
            limit,
            order_by,
            order_in,
        } = req.query;

        const _page = page ? parseInt(page) : 1;
        const _limit = limit ? parseInt(limit) : 20;
        const _skip = (_page - 1) * _limit;

        let sorting = {};
        if (order_by) {
            sorting[order_by] = order_in === 'desc' ? -1 : 1;
        } else {
            sorting['_id'] = -1;
        }

        const query = {};
        if (name) {
            query.name = new RegExp(name, 'i');
        }
        if (description) {
            query.description = new RegExp(description, 'i');
        }
        if (parentId) {
            query.parentId = parentId; // Assuming parentId is a direct match (not a regular expression)
        }

        const categories = await Category.aggregate([
            {
                $match: query,
            },
            {
                $sort: sorting,
            },
            {
                $skip: _skip,
            },
            {
                $limit: _limit,
            },
        ]);

        const categoriesCount = await Category.countDocuments(query);

        res.json({
            data: categories,
            meta: {
                current_page: _page,
                from: _skip + 1,
                last_page: Math.ceil(categoriesCount / _limit),
                per_page: _limit,
                to: Math.min(_skip + _limit, categoriesCount),
                total: categoriesCount,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Controller function to create a new category
const createCategory = async (req, res) => {
    try {
        const { name, description, parentId, disabled } = req.body;
        const newCategoryTemp = {
            name,
            description,
            disabled
        };
        if (parentId) {
            newCategory.parentId = parentId;
        }
        const newCategory = await Category.create(newCategoryTemp);
        res.status(201).json(newCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Controller function to update a category by ID
const updateCategoryById = async (req, res, next) => {
    try {
        const categoryId = req.params.id; // Assuming the ID is passed as a URL parameter
        const { name, description, parentId, disabled, is_inactive } = req.body;

        // Find the category by ID and update its fields
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name, description, parentId, disabled, is_inactive },
            { new: true } // To return the updated category
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(updatedCategory);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateCategoryById,
    listCategories,
    createCategory,
    // Add other controller functions here as needed
};
