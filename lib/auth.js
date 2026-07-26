const jwt = require("jsonwebtoken");

function getAuthenticatedUser(request) {
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization) return { status: 401, body: { message: "Token não informado" } };

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: { id: decoded.id } };
  } catch {
    return { status: 401, body: { message: "Token inválido" } };
  }
}

module.exports = { getAuthenticatedUser };
