// best practice to hide any sensitive data like passwords, even when they are hashed

export const userTransformer = (user) => {
  return {
    id: parseInt(user.id),
    name: user.name,
    email: user.email,
    username: user.username,
    profileImage: user.profileImage

  }
}