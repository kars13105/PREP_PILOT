def generate_ai_roadmap(company):

    company = company.lower()

    if company == "google":
        return [
            "Master DSA and Graphs",
            "Practice Dynamic Programming",
            "Study System Design",
            "Revise OS DBMS CN",
            "Give Mock Interviews"
        ]

    elif company == "amazon":
        return [
            "Learn Arrays and Trees",
            "Practice LeetCode Daily",
            "Study Leadership Principles",
            "Revise CS Fundamentals",
            "Practice Behavioral Interviews"
        ]

    elif company == "microsoft":
        return [
            "Focus on Problem Solving",
            "Practice Medium-Hard DSA",
            "Study Low Level Design",
            "Revise OOP Concepts",
            "Give Timed Contests"
        ]

    else:
        return [
            "Learn DSA Basics",
            "Practice Coding Daily",
            "Study Core Subjects",
            "Build Projects",
            "Prepare Mock Interviews"
        ]