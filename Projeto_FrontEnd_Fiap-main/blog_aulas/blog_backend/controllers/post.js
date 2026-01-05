const { Post, Comment, User, Op } = require('../models'); 

// listar posts (público) com busca q
exports.getPosts = async (req, res) => {
    try {
        const q = req.query.q || "";

        let where = {};
        if (q) {
            where = {
                [Op.or]: [
                    { title: { [Op.like]: `%${q}%` } },
                    { content: { [Op.like]: `%${q}%` } }
                ]
            };
        }

        const posts = await Post.findAll({
            where,
            order: [["createdAt", "DESC"]]
        });

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// ver post por id (com comentários)
exports.getPost = async (req, res) => {
    const post = await Post.findByPk(req.params.id, { include: [Comment] });
    if (!post) return res.status(404).json({ error: 'not found' });
    res.json(post);
};

// criar post (só professores autenticados)
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Preencha todos os campos" });
        }

        const post = await Post.create({
            title,
            content,
            author: req.user.username,
            userId: req.user.id
        });

        res.status(201).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// editar post (atualizado para não exigir author)
exports.putPost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post não encontrado' });

        // Atualiza apenas título e conteúdo
        post.title = req.body.title;
        post.content = req.body.content;

        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// excluir post
// excluir post
exports.deletePost = async (req, res) => {
    console.log('=== DELETE POST REQUEST ===');
    console.log('Post ID:', req.params.id);
    console.log('Usuário:', req.user);
    console.log('Headers:', req.headers);
    
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            console.log('Post não encontrado no banco');
            return res.status(404).json({ error: 'not found' });
        }
        
        console.log('Post encontrado:', post.title);
        await post.destroy();
        console.log('Post deletado com sucesso do banco');
        
        res.json({ ok: true });
    } catch (err) {
        console.error('Erro ao deletar post:', err);
        res.status(500).json({ error: err.message });
    }
};

// adicionar comentário (público)
exports.postComment = async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'not found' });
    const { author, content } = req.body;
    const comment = await Comment.create({ author, content, PostId: post.id });
    res.status(201).json(comment);
};

// Excluir comentário (só autor ou professor)
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId);
        if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });
        
        // Verifica se o usuário é o autor do comentário OU se é professor
        if (comment.author !== req.user.username && req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Não autorizado' });
        }
        
        await comment.destroy();
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Editar comentário (só autor)
exports.putComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId);
        if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });
        
        // Verifica se o usuário é o autor do comentário
        if (comment.author !== req.user.username) {
            return res.status(403).json({ error: 'Não autorizado' });
        }
        
        comment.content = req.body.content;
        await comment.save();
        res.json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};