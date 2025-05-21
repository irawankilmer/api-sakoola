import { PrismaClient } from "@prisma/client";
import { Strategy as JwtStrategy } from "passport-jwt";
import pkg from 'passport-jwt';

const { ExtractJwt } = pkg;

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        roles: { include: { role: true } }
      }
    });

    if (!user) return done(null, false);

    const userWithRoles = {
      id: user.id,
      email: user.email,
      roles: user.roles.map(r => r.role.name),
    };

    return done(null, userWithRoles);
  } catch (err) {
    return done(err, false);
  }
});

export default (passport) => {
  passport.use(strategy);
};
