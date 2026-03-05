import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";

/**
 * GET /api/users
 * Get all users
 */
export const getUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            createdAt: true
        }});

        res.json({
            status: "success",
            data: users
        });
    } catch (err) {
        next(err);
    }
};


/**
 * GET /api/users/:id
 * Get single user
 */
export const getUserById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        res.json({
            status: "success",
            data: user
        });

    } catch (err) {
        next(err);
    }
};


/**
 * POST /api/users
 * Create user
 */
export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existing = await prisma.user.findUnique({
        where: { email }
    });

    if (existing) {
        return res.status(400).json({
            status: "error",
            message: "User already exists"
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hash
        },
        select: {
            id: true,
            email: true,
            createdAt: true
        }
    });

    res.status(201).json({
        status: "success",
        data: user
    });

  } catch (err) {
        next(err);
  }
};


/**
 * PUT /api/users/:id
 * Update user
 */
export const updateUser = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { email } = req.body;

        const existing = await prisma.user.findUnique({
            where: { id }
        });

        if (!existing) {
            return res.status(404).json({
                status: "error",
                message: "User does not exists"
            });
        }

        const user = await prisma.user.update({
            where: { id },
            data: {
                email
            },
            select: {
                id: true,
                email: true,
                createdAt: true
            }
        });

        res.json({
            status: "success",
            data: user
        });

    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/users/:id
 */
export const deleteUser = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const existing = await prisma.user.findUnique({
            where: { id }
        });

        if (!existing) {
            return res.status(404).json({
                status: "error",
                message: "User does not exists"
            });
        }

        await prisma.user.delete({
            where: { id }
        });

        res.json({
            status: "success",
            message: "User deleted"
        });

    } catch (err) {
        next(err);
    }
};