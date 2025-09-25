const inputLogin = {
  email: 'gabi@gmail.com',
  password: 'coxinha123',
};

export default function authTest(expect, endpoint, prismaInstance) {
  describe('Auth user endpoint', () => {
    it('Response and auth success', async () => {
      const response = await endpoint.post('/auth', inputLogin);
      const userLogged = (await prismaInstance.user.findUnique({
        where: {
          email: inputLogin.email,
        },
      }))!;
      expect(response.status).to.be.deep.eq(200);
      expect(response.data.user).to.be.deep.eq({
        id: userLogged.id,
        name: userLogged.name,
        email: userLogged.email,
        birthDate: userLogged.birthDate,
      });
      expect(response.data).to.have.property('token');
    });

    describe('Auth error', () => {
      it('Wrong email', async () => {
        const loginEmailError = {
          email: 'jub@gmail.com',
          password: 'coxinha123',
        };
        const errorWrongEmail = {
          code: 'USR_04',
          message: 'Login fail',
          details:
            'No user was found with that email. Please check if you entered the correct email address or register.',
        };
        try {
          await endpoint.post('/auth', loginEmailError);
        } catch (error: any) {
          expect(error.response.status).to.be.deep.eq(400);
          expect(error.response.data).to.be.deep.eq(errorWrongEmail);
        }
      });
      it('Wrong password', async () => {
        const loginPasswordError = {
          email: 'gabi@gmail.com',
          password: 'coxinha23',
        };
        const errorWrongPassword = {
          code: 'USR_05',
          message: 'Login fail',
          details: 'Incorrect password. Try again.',
        };
        try {
          await endpoint.post('/auth', loginPasswordError);
        } catch (error: any) {
          expect(error.response.status).to.be.deep.eq(400);
          expect(error.response.data).to.be.deep.eq(errorWrongPassword);
        }
      });
    });
  });
}
