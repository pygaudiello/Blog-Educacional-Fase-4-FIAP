const express = require('express');
const router = express.Router();
const { Post, Comment, User, Op } = require('../models');
const { authenticateToken, requireTeacher } = require('../middleware/auth');
const postController = require('../controllers/post');

// listar posts (público) com busca q
router.get("/", postController.getPosts);

// ver post por id (com comentários)
router.get('/:id', postController.getPost);

// criar post (só professores autenticados)
/*router.post("/", authenticateToken, requireTeacher, async (req, res) => {
    try {
        const { title, content, userId } = req.body;

        if (!title || !content || !userId) {
        return res.status(400).json({ error: "Preencha todos os campos" });
        }

        const post = await Post.create({ title, content, userId });
        res.status(201).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});*/

// criar post (só professores autenticados)
router.post("/", authenticateToken, requireTeacher, postController.createPost);

// editar post
router.put('/:id', authenticateToken, requireTeacher, postController.putPost);

// excluir post
router.delete('/:id', authenticateToken, requireTeacher, postController.deletePost);

// adicionar comentário (público)
router.post('/:id/comments', postController.postComment);

// Excluir comentário (só autor ou professor)
router.delete('/:id/comments/:commentId', authenticateToken, postController.deleteComment);

// Editar comentário (só autor) - se você quiser manter essa funcionalidade
router.put('/:id/comments/:commentId', authenticateToken, postController.putComment);

module.exports = router;

