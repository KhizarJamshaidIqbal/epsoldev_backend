# Use Debian-based image (works better with sharp prebuilt binaries)
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
# Don't use `npm ci` since lockfile is out of sync
RUN npm install --omit=dev

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5000
CMD ["npm","start"]
