
  
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import prisma from '../config/prisma';
import  {createUser , findOne} from '../services/auth.service' 


passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
     // callbackURL: "http://localhost:8000/auth/github/callback"
    },  
    async (accessToken : any, refreshToken : any, profile : any, done : any) => {
      try { 
        let email = profile.username + '@gmail.com'
        let name =  profile.username 
        let password = profile.nodeId 
        let avatar = profile.photos[0].value 

          
        let user 
        user = await findOne({email})
    
           if(!user){
             user = await createUser({name,email,password,avatar}) 
           }
        
         return done(null, user);
      } catch (error) { 
        return done(error, null);
      }
    }
  )
);
 

// Serialize user for session storage
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session storage
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

