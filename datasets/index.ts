import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const data = await prisma.user.findMany({
		take: 10,
		orderBy: {
			comments: {
				_count: 'desc',
			},
		},
		include: {
			comments: {
				where: {
					fragments: {
						some: {
							text: {
								contains: 'cum',
							},
						},
					},
				},
			},
		},
	});

	console.table(data);
}

main();
